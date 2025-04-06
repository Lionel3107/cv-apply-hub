
import { Applicant, ApplicationStatus } from "@/types/applicant";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ApplicantActions } from "./ApplicantActions";

interface ApplicantRowProps {
  applicant: Applicant;
  isSelected: boolean;
  onSelect: () => void;
  onStatusChange: (applicantId: string, newStatus: ApplicationStatus) => Promise<void>;
  onDelete: (applicantId: string) => Promise<void>;
  onViewApplicant?: (applicant: Applicant) => void;
  onViewCoverLetter?: (applicant: Applicant) => void;
  onEditApplicant?: (applicant: Applicant) => void;
  onMessageApplicant?: (applicant: Applicant) => void;
}

export const ApplicantRow = ({
  applicant,
  isSelected,
  onSelect,
  onStatusChange,
  onDelete,
  onViewApplicant,
  onViewCoverLetter,
  onEditApplicant,
  onMessageApplicant
}: ApplicantRowProps) => {
  const getActionBadge = (action: Applicant["action"]) => {
    switch (action) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "shortlisted":
        return <Badge className="bg-purple-500">Shortlisted</Badge>;
      case "interviewed":
        return <Badge className="bg-orange-500">Interviewed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "hired":
        return <Badge className="bg-green-500">Hired</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <TableRow key={applicant.id}>
      <TableCell>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4"
        />
      </TableCell>
      <TableCell>
        <div className="font-medium">{applicant.name}</div>
      </TableCell>
      <TableCell>{applicant.email}</TableCell>
      <TableCell>{new Date(applicant.appliedDate).toLocaleDateString()}</TableCell>
      <TableCell>
        {getActionBadge(applicant.action)}
      </TableCell>
      <TableCell className="text-right">
        <ApplicantActions 
          applicant={applicant}
          onViewApplicant={onViewApplicant}
          onViewCoverLetter={onViewCoverLetter}
          onEditApplicant={onEditApplicant}
          onDeleteApplicant={onDelete}
          onChangeAction={onStatusChange}
          onMessageApplicant={onMessageApplicant}
        />
      </TableCell>
    </TableRow>
  );
};
