
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateJobApplicationForm } from "@/utils/formValidation";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
}

export const useApplicationForm = (jobId?: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: ""
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateJobApplicationForm(formData.fullName, formData.email, resumeFile)) {
      return;
    }
    

    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your application.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (!jobId) {
      toast({
        title: "Error",
        description: "Missing job information. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let resumeUrl = null;
      
      // Upload resume file if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(filePath, resumeFile);
          
        if (uploadError) {
          throw new Error(`Resume upload failed: ${uploadError.message}`);
        }
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('applications')
          .getPublicUrl(filePath);
          
        resumeUrl = publicUrl;
      }
      
      // Cover letter is now stored as text, not as a file
      
      // Submit application to Supabase
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          user_id: user.id,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          resume_url: resumeUrl,
          cover_letter: formData.coverLetter || null,
          status: 'new',
          applied_date: new Date().toISOString(),

        });
        
      if (applicationError) {
        throw new Error(`Application submission failed: ${applicationError.message}`);
      }
      
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
        action: (
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
        ),
      });
      
      navigate("/application-success");
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    resumeFile,
    isSubmitting,
    fileError,
    setResumeFile,
    setFileError,
    handleInputChange,
    handleSubmit
  };
};
