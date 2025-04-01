
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateJobApplicationForm } from "@/utils/formValidation";
import { Check } from "lucide-react";

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
}

export const useApplicationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateJobApplicationForm(formData.fullName, formData.email, resumeFile)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Application submitted:", { ...formData, resumeFile });
      
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
        action: (
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
        ),
      });
      
      setIsSubmitting(false);
      navigate("/application-success");
    }, 1500);
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
