
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { ApplicantWithScore } from "@/types/applicant";
import { toast } from "sonner";

interface ApplicantActionsProps {
  applicant: ApplicantWithScore;
  onViewProfile: (applicant: ApplicantWithScore) => void;
  onViewCoverLetter: (applicant: ApplicantWithScore) => void;
}

export const ApplicantActions: React.FC<ApplicantActionsProps> = ({
  applicant,
  onViewProfile,
  onViewCoverLetter
}) => {
  const handleDownloadCV = (applicant: ApplicantWithScore) => {
    if (applicant.resumeUrl) {
      window.open(applicant.resumeUrl, '_blank');
    } else {
      toast.info(`No resume uploaded for ${applicant.name}`);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onViewProfile(applicant)}
      >
        <Eye className="h-4 w-4 mr-1" />
        Profile
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onViewCoverLetter(applicant)}
      >
        <Eye className="h-4 w-4 mr-1" />
        Cover Letter
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleDownloadCV(applicant)}
      >
        <Download className="h-4 w-4 mr-1" />
        CV
      </Button>
    </div>
  );
};
