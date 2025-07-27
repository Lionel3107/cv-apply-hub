
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ResumeUpload from "@/components/forms/ResumeUpload";
import CoverLetterUpload from "@/components/forms/CoverLetterUpload";
import { useApplicationForm } from "@/hooks/use-application-form";
import { Job } from "@/types/job";
import { Brain, Shield, Info } from "lucide-react";

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
    aiConsent,
    setAiConsent,
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
          
          {/* AI Consent Section */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      AI-Powered Application Processing
                    </h4>
                    <p className="text-sm text-blue-800 mb-3">
                      To provide you with the best application experience and help recruiters evaluate your profile effectively, 
                      we use artificial intelligence to analyze your resume and application materials.
                    </p>
                    
                    <Alert className="bg-blue-100 border-blue-300">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 text-sm">
                        <strong>What we do:</strong> Our AI analyzes your resume to extract skills, experience, and qualifications 
                        to help match you with the right opportunities and provide feedback to recruiters.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert className="bg-green-100 border-green-300 mt-3">
                      <Shield className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 text-sm">
                        <strong>Your data is protected:</strong> All information is processed securely, and we do not share your 
                        personal data with third parties. You can request deletion of your data at any time.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="ai-consent"
                    checked={aiConsent}
                    onCheckedChange={(checked) => setAiConsent(checked as boolean)}
                    required
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="ai-consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I consent to AI processing of my application materials *
                    </Label>
                    <p className="text-xs text-blue-700">
                      By checking this box, you agree to allow our AI system to analyze your resume and application 
                      to enhance your application experience and help recruiters evaluate your profile.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          type="submit" 
          className="w-full mt-6 bg-brand-blue hover:bg-brand-darkBlue"
          disabled={isSubmitting || !!fileError || !aiConsent}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
