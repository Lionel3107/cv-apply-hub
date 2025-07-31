import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Check for required environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const pdfCoApiKey = Deno.env.get('PDFCO_API_KEY') || 'dlmsonelterror@gmail.com_up3BBLN0ZhbNpIvqzyKQCGBSPe1TyYTY2rDf5aYmBiTfbUC3ik1aXAYZPk3Jfd9Z';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

if (!openAIApiKey) {
  throw new Error("Missing OpenAI API key. Please set OPENAI_API_KEY environment variable.");
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    // Init Supabase client with service role key
    console.log('🔧 Initializing Supabase client...');
    console.log('🔧 Supabase URL:', supabaseUrl);
    console.log('🔧 Service key configured:', !!supabaseServiceKey);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test connection
    console.log('🔧 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('applications')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection test failed:', testError);
      throw new Error(`Supabase connection failed: ${testError.message}`);
    } else {
      console.log('✅ Supabase connection successful');
    }
    
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
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    const { applicationId, jobDescription } = requestData;
    
    // Validation des champs requis
    if (!applicationId || !jobDescription) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: applicationId or jobDescription'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log(`Starting CV analysis for application: ${applicationId}`);
    
    // Fetch the application data including the resume URL
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('id, name, email, resume_url')
      .eq('id', applicationId)
      .single();
    
    if (fetchError || !application) {
      console.error('❌ Error fetching application:', fetchError);
      throw new Error(`Application not found: ${fetchError?.message || 'Unknown error'}`);
    }
    
    console.log('✅ Application found:', application);
    
    if (!application.resume_url) {
      console.log('⚠️ No resume URL found, using basic analysis');
      // Fallback to basic analysis without CV content
      const basicAnalysis = await performBasicAnalysis(application, jobDescription);
      await updateApplication(supabase, applicationId, basicAnalysis);
      
      return new Response(JSON.stringify({
        success: true,
        analysis: basicAnalysis,
        message: 'Basic analysis completed (no CV content available)'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Extract CV content using OpenAI
    console.log('📄 Extracting CV content from:', application.resume_url);
    const cvContent = await extractCVContent(application.resume_url);
    
    if (!cvContent) {
      console.log('⚠️ Could not extract CV content, using basic analysis');
      const basicAnalysis = await performBasicAnalysis(application, jobDescription);
      await updateApplication(supabase, applicationId, basicAnalysis);
      
      return new Response(JSON.stringify({
        success: true,
        analysis: basicAnalysis,
        message: 'Basic analysis completed (CV content extraction failed)'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Perform comprehensive analysis with CV content
    console.log('🔍 Performing comprehensive CV analysis...');
    const analysis = await performComprehensiveAnalysis(application, jobDescription, cvContent);
    
    // Update the application with analysis results
    await updateApplication(supabase, applicationId, analysis);
    
    return new Response(JSON.stringify({
      success: true,
      analysis: analysis
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('❌ Error in CV analysis function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

async function extractCVContent(resumeUrl: string): Promise<string | null> {
  try {
    console.log('📄 Fetching CV content from URL:', resumeUrl);
    
    // Fetch the CV file
    const response = await fetch(resumeUrl);
    if (!response.ok) {
      console.error('❌ Failed to fetch CV file:', response.status, response.statusText);
      return null;
    }
    
    const cvBuffer = await response.arrayBuffer();
    
    console.log('📄 PDF file fetched, size:', cvBuffer.byteLength, 'bytes');
    console.log('📄 Using Pdf.co API for text extraction...');
    
    // Use Pdf.co API to extract text from PDF
    const pdfCoResponse = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
      method: 'POST',
      headers: {
        'x-api-key': pdfCoApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: resumeUrl,
        pages: 'all',
        outputFormat: 'text'
      })
    });
    
    if (!pdfCoResponse.ok) {
      const errorText = await pdfCoResponse.text();
      console.error('❌ Pdf.co API extraction failed:', pdfCoResponse.status, errorText);
      return null;
    }
    
    const pdfCoData = await pdfCoResponse.json();
    
    if (pdfCoData.error) {
      console.error('❌ Pdf.co API returned error:', pdfCoData.message);
      return null;
    }
    
    // Pdf.co returns a URL to the extracted text file
    if (pdfCoData.url) {
      console.log('📄 Pdf.co returned text URL:', pdfCoData.url);
      
      // Fetch the extracted text from the URL
      const textResponse = await fetch(pdfCoData.url);
      if (!textResponse.ok) {
        console.error('❌ Failed to fetch extracted text:', textResponse.status, textResponse.statusText);
        return null;
      }
      
      const extractedContent = await textResponse.text();
      
      console.log('✅ CV text extracted successfully via Pdf.co, length:', extractedContent.length);
      console.log('📄 First 200 characters:', extractedContent.substring(0, 200));
      
      return extractedContent.trim();
    } else {
      console.error('❌ Pdf.co API did not return a URL');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error extracting CV content:', error);
    return null;
  }
}

async function performComprehensiveAnalysis(application: any, jobDescription: string, cvContent: string): Promise<any> {
  const sanitizedJobDescription = jobDescription.replace(/[<>]/g, '').substring(0, 2000);
  const sanitizedCvContent = cvContent.replace(/[<>]/g, '').substring(0, 3000);
  
  const prompt = `
You are an expert HR recruiter analyzing a candidate's CV for a specific job position.

JOB DESCRIPTION:
${sanitizedJobDescription}

CANDIDATE CV CONTENT:
${sanitizedCvContent}

CANDIDATE INFO:
Name: ${application.name}
Email: ${application.email}

Please analyze this candidate's CV and provide:
1. A compatibility score from 0 to 100 (where 100 is perfect match)
2. Key strengths that match the job requirements
3. Areas where the candidate may need improvement
4. Overall recommendation (Highly Recommended, Recommended, Maybe, Not Recommended)
5. Brief feedback for the candidate
6. Extracted skills (as an array)
7. Summarized experience
8. Education background

Format your response as JSON:
{
  "score": number,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "recommendation": "string",
  "feedback": "string",
  "skills": ["skill1", "skill2"],
  "experience": "string",
  "education": "string"
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR recruiter. Analyze candidates objectively and provide constructive feedback. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
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
  
  // Parse the JSON response from OpenAI
  let analysis;
  try {
    analysis = JSON.parse(analysisText);
    
    // Validation de la structure de réponse
    if (typeof analysis.score !== 'number' || !Array.isArray(analysis.strengths) || !Array.isArray(analysis.improvements) || typeof analysis.recommendation !== 'string' || typeof analysis.feedback !== 'string') {
      throw new Error('Invalid analysis structure');
    }
    
    // Validation des valeurs
    analysis.score = Math.max(0, Math.min(100, analysis.score));
    
    // Ensure extracted fields exist
    analysis.skills = analysis.skills || [];
    analysis.experience = analysis.experience || 'Not provided';
    analysis.education = analysis.education || 'Not provided';
    
  } catch (e) {
    console.error('Failed to parse OpenAI response as JSON:', analysisText);
    console.error('Parse error:', e);
    
    // Fallback analysis
    analysis = {
      score: 50,
      strengths: ["Profile reviewed"],
      improvements: ["More detailed information needed"],
      recommendation: "Maybe",
      feedback: "Unable to fully analyze the CV. Please provide more detailed information.",
      skills: [],
      experience: "Not provided",
      education: "Not provided"
    };
  }
  
  return analysis;
}

async function performBasicAnalysis(application: any, jobDescription: string): Promise<any> {
  const sanitizedJobDescription = jobDescription.replace(/[<>]/g, '').substring(0, 2000);
  
  const prompt = `
You are an expert HR recruiter analyzing a candidate's basic profile for a specific job position.

JOB DESCRIPTION:
${sanitizedJobDescription}

CANDIDATE INFO:
Name: ${application.name}
Email: ${application.email}

Please analyze this candidate based on available information and provide:
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
  "feedback": "string",
  "skills": [],
  "experience": "Not provided",
  "education": "Not provided"
}
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR recruiter. Analyze candidates objectively and provide constructive feedback. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
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
  
  let analysis;
  try {
    analysis = JSON.parse(analysisText);
    analysis.score = Math.max(0, Math.min(100, analysis.score));
    analysis.skills = [];
    analysis.experience = "Not provided";
    analysis.education = "Not provided";
  } catch (e) {
    console.error('Failed to parse OpenAI response as JSON:', analysisText);
    analysis = {
      score: 50,
      strengths: ["Profile reviewed"],
      improvements: ["More detailed information needed"],
      recommendation: "Maybe",
      feedback: "Unable to fully analyze the profile. Please provide more detailed information.",
      skills: [],
      experience: "Not provided",
      education: "Not provided"
    };
  }
  
  return analysis;
}

async function updateApplication(supabase: any, applicationId: string, analysis: any): Promise<void> {
  console.log(`Updating application ${applicationId} with score: ${analysis.score}`);
  console.log(`Feedback data to store:`, JSON.stringify({
    score: analysis.score,
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    recommendation: analysis.recommendation,
    feedback: analysis.feedback
  }));
  
  console.log(`Attempting to update application ${applicationId}...`);
  
  // First, verify the application exists
  const { data: existingApp, error: fetchError } = await supabase
    .from('applications')
    .select('id, name')
    .eq('id', applicationId)
    .single();
  
  if (fetchError) {
    console.error('❌ Error fetching application:', fetchError);
    throw new Error(`Application not found: ${fetchError.message}`);
  }
  
  console.log('✅ Application found:', existingApp);
  
  let updateError = null;
  try {
    const { error } = await supabase.from('applications').update({
      score: analysis.score,
      feedback: JSON.stringify({
        score: analysis.score,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
        recommendation: analysis.recommendation,
        feedback: analysis.feedback
      }),
      skills: analysis.skills || [],
      experience: analysis.experience || '',
      education: analysis.education || '',
      updated_at: new Date().toISOString()
    }).eq('id', applicationId);
    
    updateError = error;
  } catch (e) {
    console.error('❌ Exception during update:', e);
    updateError = { message: e.message };
  }
  
  if (updateError) {
    console.error('❌ Failed to update application with analysis results:', updateError);
    console.error('❌ Error details:', {
      message: updateError.message,
      code: updateError.code,
      details: updateError.details,
      hint: updateError.hint
    });
    throw new Error(`Failed to update application with analysis results: ${updateError.message}`);
  }
  
  console.log('✅ Application updated successfully with analysis results');
} 