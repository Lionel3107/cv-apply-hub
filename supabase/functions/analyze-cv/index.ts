import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CVAnalysisRequest {
  applicationId: string;
  jobDescription: string;
  candidateData: {
    name: string;
    email: string;
    experience: string;
    education: string;
    skills: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { applicationId, jobDescription, candidateData }: CVAnalysisRequest = await req.json();

    console.log(`Analyzing CV for application: ${applicationId}`);

    const prompt = `
You are an expert HR recruiter analyzing a candidate's profile for a specific job position. 

JOB DESCRIPTION:
${jobDescription}

CANDIDATE PROFILE:
Name: ${candidateData.name}
Email: ${candidateData.email}
Experience: ${candidateData.experience || 'Not provided'}
Education: ${candidateData.education || 'Not provided'}
Skills: ${candidateData.skills?.join(', ') || 'Not provided'}

Please analyze this candidate and provide:
1. A compatibility score from 0 to 100 (where 100 is perfect match)
2. Key strengths that match the job requirements
3. Areas where the candidate may need improvement
4. Overall recommendation (Highly Recommended, Recommended, Maybe, Not Recommended)
5. Brief feedback for the candidate

Format your response as JSON:
{
  "score": number,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "recommendation": "string",
  "feedback": "string"
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert HR recruiter. Analyze candidates objectively and provide constructive feedback. Always respond with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    // Parse the JSON response from OpenAI
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', analysisText);
      // Fallback analysis if JSON parsing fails
      analysis = {
        score: 50,
        strengths: ["Profile reviewed"],
        improvements: ["More detailed information needed"],
        recommendation: "Maybe",
        feedback: "Unable to fully analyze the profile. Please provide more detailed information."
      };
    }

    // Update the application with the analysis results
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        score: analysis.score,
        feedback: analysis.feedback,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application:', updateError);
      throw new Error('Failed to update application with analysis results');
    }

    console.log(`CV analysis completed for application ${applicationId} with score: ${analysis.score}`);

    return new Response(JSON.stringify({
      success: true,
      analysis: {
        applicationId,
        score: analysis.score,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        recommendation: analysis.recommendation,
        feedback: analysis.feedback,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in CV analysis function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});