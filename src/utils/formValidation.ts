
import { toast } from "@/hooks/use-toast";

export const validateJobApplicationForm = (
  fullName: string,
  email: string,
  resumeFile: File | null
): boolean => {
  if (!fullName || !email || !resumeFile) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Please fill in all required fields and upload your resume."
    });
    return false;
  }
  
  return true;
};
