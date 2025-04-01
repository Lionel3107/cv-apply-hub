
import { Applicant } from "@/types/applicant";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Eye, 
  MessageSquare, 
  UserCheck, 
  UserX, 
  Edit,
  Trash2,
  FileText
} from "lucide-react";

interface ApplicantActionsProps {
  applicant: Applicant;
  onViewApplicant: (applicant: Applicant) => void;
  onViewCoverLetter: (applicant: Applicant) => void;
  onEditApplicant: (applicant: Applicant) => void;
  onDeleteApplicant: (applicant: Applicant) => void;
}

export const ApplicantActions = ({
  applicant,
  onViewApplicant,
  onViewCoverLetter,
  onEditApplicant,
  onDeleteApplicant
}: ApplicantActionsProps) => {
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
      <Button variant="outline" size="sm" onClick={() => onEditApplicant(applicant)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
      >
        <UserCheck className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <UserX className="h-4 w-4" />
      </Button>
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
