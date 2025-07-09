import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  matchReason: string;
  description: string;
  type: string;
  category: string;
  requirements: string[];
  benefits: string[];
  salary: string | null;
  isRemote: boolean;
  postedDate: string;
}

export const useCVJobMatching = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const { toast } = useToast();

  const matchCVToJobs = async (cvFile: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);

      const { data, error } = await supabase.functions.invoke('match-cv-to-jobs', {
        body: formData,
      });

      if (error) {
        throw error;
      }

      setMatchedJobs(data.matches || []);
      toast({
        title: "CV Analysis Complete",
        description: `Found ${data.matches?.length || 0} matching jobs`,
      });
    } catch (error) {
      console.error('Error matching CV to jobs:', error);
      toast({
        title: "Error",
        description: "Failed to analyze CV and match jobs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    matchCVToJobs,
    matchedJobs,
    isLoading,
  };
};