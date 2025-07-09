
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ResumeUpload from "@/components/forms/ResumeUpload";
import CoverLetterUpload from "@/components/forms/CoverLetterUpload";
import { useApplicationForm } from "@/hooks/use-application-form";
import { Job } from "@/types/job";

interface JobApplicationFormProps {
  job: Job;
}

const JobApplicationForm = ({ job }: JobApplicationFormProps) => {
  const {
    formData,
    resumeFile,
    coverLetterFile,
    isSubmitting,
    fileError,
    coverLetterError,
    setResumeFile,
    setFileError,
    setCoverLetterFile,
    setCoverLetterError,
    handleInputChange,
    handleSubmit
  } = useApplicationForm(job.id);
  
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
          
          <ResumeUpload
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            fileError={fileError}
            setFileError={setFileError}
          />
          
          <CoverLetterUpload
            coverLetterFile={coverLetterFile}
            setCoverLetterFile={setCoverLetterFile}
            fileError={coverLetterError}
            setFileError={setCoverLetterError}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6 bg-brand-blue hover:bg-brand-darkBlue"
          disabled={isSubmitting || !!fileError || !!coverLetterError}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
