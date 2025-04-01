
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUp, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Job } from "@/types/job";

interface JobApplicationFormProps {
  job: Job;
}

const JobApplicationForm = ({ job }: JobApplicationFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setFileError("Only PDF files are accepted. Please upload a PDF file.");
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File is too large. Maximum size is 5MB.");
        return;
      }
      
      setResumeFile(file);
    }
  };
  
  const removeFile = () => {
    setResumeFile(null);
    setFileError(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !resumeFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields and upload your resume."
      });
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
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Apply for this position</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label htmlFor="resume">Resume/CV (PDF only) *</Label>
            {resumeFile ? (
              <div className="flex items-center p-3 border rounded-md bg-gray-50">
                <div className="flex-1 truncate">
                  {resumeFile.name}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={removeFile}
                >
                  <X size={18} />
                </Button>
              </div>
            ) : (
              <div className="mt-1">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue"
                  onClick={() => document.getElementById("resume")?.click()}
                >
                  <FileUp className="mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF files only, up to 5MB</p>
                </div>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
              </div>
            )}
            {fileError && (
              <p className="text-sm text-red-500 mt-1">{fileError}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              placeholder="Tell us why you're a great fit for this role"
              rows={5}
              value={formData.coverLetter}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6 bg-brand-blue hover:bg-brand-darkBlue"
          disabled={isSubmitting || !!fileError}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
