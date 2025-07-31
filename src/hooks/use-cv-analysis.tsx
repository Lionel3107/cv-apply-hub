import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CVAnalysisData {
  applicationId: string;
  jobDescription: string;
}

interface CVAnalysisResult {
  success: boolean;
  analysis?: {
    score: number;
    strengths: string[];
    improvements: string[];
    recommendation: string;
    feedback: string;
    skills?: string[];
    experience?: string;
    education?: string;
  };
  error?: string;
}

export const useCVAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCV = async (data: CVAnalysisData): Promise<CVAnalysisResult> => {
    setIsAnalyzing(true);
    
    try {
      console.log('Starting CV analysis for:', data.applicationId);
      console.log('Analysis data:', JSON.stringify(data, null, 2));
      
      const { data: result, error } = await supabase.functions.invoke('analyze-cv', {
        body: data
      });
      
      console.log('Analysis result:', result);
      console.log('Analysis error:', error);

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
      console.log(`Starting bulk analysis for ${applications.length} applications`);
      
      for (let i = 0; i < applications.length; i++) {
        const app = applications[i];
        console.log(`Analyzing application ${i + 1}/${applications.length}: ${app.name}`);
        
        const data: CVAnalysisData = {
          applicationId: app.id,
          jobDescription
        };
        
        const result = await analyzeCV(data);
        results.push(result);
        
        // Show progress
        if (i % 3 === 0) {
          toast.info(`Analyzed ${i + 1}/${applications.length} CVs...`);
        }
        
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const successCount = results.filter(r => r.success).length;
      toast.success(`Analyzed ${successCount}/${applications.length} CVs successfully`);
      
      if (successCount < applications.length) {
        toast.error(`${applications.length - successCount} CVs failed to analyze`);
      }
      
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