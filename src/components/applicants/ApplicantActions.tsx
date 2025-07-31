
import { Applicant } from "@/types/applicant";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Eye, 
  FileText,
  Check,
  X,
  Clock,
  ListFilter,
  UserCheck,
  Trash2,
  MessageSquare,
  Brain
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCVAnalysis } from "@/hooks/use-cv-analysis";

interface ApplicantActionsProps {
  applicant: Applicant;
  jobDescription?: string;
  onViewApplicant: (applicant: Applicant) => void;
  onViewCoverLetter: (applicant: Applicant) => void;
  onEditApplicant: (applicant: Applicant) => void;
  onDeleteApplicant: (applicant: Applicant) => void;
  onChangeAction: (applicant: Applicant, action: Applicant["action"]) => void;
  onMessageApplicant?: (applicant: Applicant) => void;
}

export const ApplicantActions = ({
  applicant,
  jobDescription,
  onViewApplicant,
  onViewCoverLetter,
  onEditApplicant,
  onDeleteApplicant,
  onChangeAction,
  onMessageApplicant
}: ApplicantActionsProps) => {
  const { analyzeCV, isAnalyzing } = useCVAnalysis();

  const handleAnalyzeCV = async () => {
    if (!jobDescription) {
      alert('Job description is required for CV analysis');
      return;
    }

    await analyzeCV({
      applicationId: applicant.id,
      jobDescription
    });
  };
  const handleDownloadResume = () => {
    if (applicant.resumeUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = applicant.resumeUrl;
      link.setAttribute('download', `${applicant.name.replace(/\s+/g, '_')}_resume.pdf`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex justify-end gap-1">
      <Button variant="outline" size="sm" onClick={() => onViewApplicant(applicant)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onViewCoverLetter(applicant)}
        className="text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        <FileText className="h-4 w-4" />
      </Button>
      {onMessageApplicant && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onMessageApplicant(applicant)}
          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAnalyzeCV}
        disabled={isAnalyzing || !jobDescription}
        className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
      >
        <Brain className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleDownloadResume}
        disabled={!applicant.resumeUrl}
        className={!applicant.resumeUrl ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Download className="h-4 w-4" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-gray-700">
            <ListFilter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => onChangeAction(applicant, "new")}
            className="text-blue-500 cursor-pointer"
          >
            <Clock className="h-4 w-4 mr-2" /> Mark as New
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onChangeAction(applicant, "shortlisted")}
            className="text-purple-500 cursor-pointer"
          >
            <ListFilter className="h-4 w-4 mr-2" /> Shortlist
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onChangeAction(applicant, "interviewed")}
            className="text-orange-500 cursor-pointer"
          >
            <Check className="h-4 w-4 mr-2" /> Mark as Interviewed
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onChangeAction(applicant, "hired")}
            className="text-green-500 cursor-pointer"
          >
            <UserCheck className="h-4 w-4 mr-2" /> Hire
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onChangeAction(applicant, "rejected")}
            className="text-red-500 cursor-pointer"
          >
            <X className="h-4 w-4 mr-2" /> Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={() => onDeleteApplicant(applicant)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
