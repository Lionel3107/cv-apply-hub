
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ResumeUpload from "@/components/forms/ResumeUpload";
import { useApplicationForm } from "@/hooks/use-application-form";
import { Job } from "@/types/job";

interface JobApplicationFormProps {
  job: Job;
}

const JobApplicationForm = ({ job }: JobApplicationFormProps) => {
  const {
    formData,
    resumeFile,
    isSubmitting,
    fileError,
    setResumeFile,
    setFileError,
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
