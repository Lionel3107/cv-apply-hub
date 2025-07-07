import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CVAnalysisData {
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

interface CVAnalysisResult {
  success: boolean;
  analysis?: {
    applicationId: string;
    score: number;
    strengths: string[];
    improvements: string[];
    recommendation: string;
    feedback: string;
  };
  error?: string;
}

export const useCVAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCV = async (data: CVAnalysisData): Promise<CVAnalysisResult> => {
    setIsAnalyzing(true);
    
    try {
      console.log('Starting CV analysis for:', data.applicationId);
      
      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: data
      });

      if (error) {
        console.error('CV analysis error:', error);
        toast.error('Failed to analyze CV: ' + error.message);
        return { success: false, error: error.message };
      }

      if (result?.success) {
        toast.success(`CV analyzed successfully! Score: ${result.analysis.score}/100`);
        return result;
      } else {
        toast.error('CV analysis failed: ' + (result?.error || 'Unknown error'));
        return { success: false, error: result?.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error during CV analysis:', error);
      toast.error('Failed to analyze CV');
      return { success: false, error: 'Network error' };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeBulkCVs = async (applications: any[], jobDescription: string) => {
    setIsAnalyzing(true);
    const results = [];
    
    try {
      for (const app of applications) {
        const data: CVAnalysisData = {
          applicationId: app.id,
          jobDescription,
          candidateData: {
            name: app.name,
            email: app.email,
            experience: app.experience || '',
            education: app.education || '',
            skills: app.skills || []
          }
        };
        
        const result = await analyzeCV(data);
        results.push(result);
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast.success(`Analyzed ${results.filter(r => r.success).length} CVs successfully`);
      return results;
    } catch (error) {
      console.error('Error during bulk CV analysis:', error);
      toast.error('Failed to analyze CVs in bulk');
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeCV,
    analyzeBulkCVs,
    isAnalyzing
  };
};