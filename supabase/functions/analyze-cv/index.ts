import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const openAIApiKey = Deno.env.get('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');
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
    // Vérification de la clé API
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'OpenAI API key not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Validation des données d'entrée
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid JSON in request body' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { applicationId, jobDescription, candidateData }: CVAnalysisRequest = requestData;

    // Validation des champs requis
    if (!applicationId || !jobDescription || !candidateData) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: applicationId, jobDescription, or candidateData' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validation supplémentaire des données candidat
    if (!candidateData.name || !candidateData.email) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Candidate name and email are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Starting CV analysis for application: ${applicationId}`);

    // Sanitization du prompt pour éviter l'injection
    const sanitizedJobDescription = jobDescription.replace(/[<>]/g, '').substring(0, 2000);
    const sanitizedName = candidateData.name.replace(/[<>]/g, '').substring(0, 100);
    const sanitizedEmail = candidateData.email.replace(/[<>]/g, '').substring(0, 100);
    const sanitizedExperience = (candidateData.experience || '').replace(/[<>]/g, '').substring(0, 1000);
    const sanitizedEducation = (candidateData.education || '').replace(/[<>]/g, '').substring(0, 1000);

    const prompt = `
You are an expert HR recruiter analyzing a candidate's profile for a specific job position. 

JOB DESCRIPTION:
${sanitizedJobDescription}

CANDIDATE PROFILE:
Name: ${sanitizedName}
Email: ${sanitizedEmail}
Experience: ${sanitizedExperience || 'Not provided'}
Education: ${sanitizedEducation || 'Not provided'}
Skills: ${candidateData.skills?.slice(0, 20)?.join(', ') || 'Not provided'}

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
            content: 'You are an expert HR recruiter. Analyze candidates objectively and provide constructive feedback. Always respond with valid JSON only, no additional text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    const analysisText = data.choices[0].message.content;

    // Parse the JSON response from OpenAI avec meilleure gestion d'erreur
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
      
      // Validation de la structure de réponse
      if (typeof analysis.score !== 'number' || 
          !Array.isArray(analysis.strengths) || 
          !Array.isArray(analysis.improvements) ||
          typeof analysis.recommendation !== 'string' ||
          typeof analysis.feedback !== 'string') {
        throw new Error('Invalid analysis structure');
      }

      // Validation des valeurs
      analysis.score = Math.max(0, Math.min(100, analysis.score));
      
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', analysisText);
      console.error('Parse error:', e);
      
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

    console.log(`CV analysis completed successfully for application ${applicationId} with score: ${analysis.score}`);

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
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});