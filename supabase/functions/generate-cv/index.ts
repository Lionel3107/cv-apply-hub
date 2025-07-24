import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
  jobDescription?: string;
  action: 'generate' | 'enhance' | 'tailor';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data: CVData = await req.json();
    
    let prompt = '';
    
    switch (data.action) {
      case 'generate':
        prompt = `Create a professional CV in HTML format based on the following information:
        
Personal Info: ${JSON.stringify(data.personalInfo)}
Summary: ${data.summary}
Experience: ${JSON.stringify(data.experience)}
Education: ${JSON.stringify(data.education)}
Skills: ${data.skills.join(', ')}

Create a clean, modern HTML CV with proper styling. Use inline CSS for styling. Make it professional and visually appealing. Include all sections and make sure the content flows well.`;
        break;
        
      case 'enhance':
        prompt = `Enhance and improve the following CV content to make it more professional and compelling:
        
Personal Info: ${JSON.stringify(data.personalInfo)}
Summary: ${data.summary}
Experience: ${JSON.stringify(data.experience)}
Education: ${JSON.stringify(data.education)}
Skills: ${data.skills.join(', ')}

Improve the language, add impact metrics where possible, make descriptions more engaging, and ensure it follows best practices. Return the enhanced content in HTML format with inline CSS styling.`;
        break;
        
      case 'tailor':
        prompt = `Tailor the following CV to match this job description:

Job Description: ${data.jobDescription}

CV Content:
Personal Info: ${JSON.stringify(data.personalInfo)}
Summary: ${data.summary}
Experience: ${JSON.stringify(data.experience)}
Education: ${JSON.stringify(data.education)}
Skills: ${data.skills.join(', ')}

Customize the CV to highlight relevant skills and experience that match the job requirements. Adjust the summary and experience descriptions to align with the job posting. Return the tailored CV in HTML format with inline CSS styling.`;
        break;
    }

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
            content: 'You are a professional CV writer. Create well-formatted HTML CVs with modern, clean styling using inline CSS. Make them professional and visually appealing.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    const generatedCV = result.choices[0].message.content;

    return new Response(JSON.stringify({ 
      success: true,
      cvHtml: generatedCV,
      action: data.action
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in CV generation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});