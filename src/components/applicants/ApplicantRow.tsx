
import { Applicant } from "@/types/applicant";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ApplicantActions } from "./ApplicantActions";

interface ApplicantRowProps {
  applicant: Applicant;
  onViewApplicant: (applicant: Applicant) => void;
  onViewCoverLetter: (applicant: Applicant) => void;
  onEditApplicant: (applicant: Applicant) => void;
  onDeleteApplicant: (applicant: Applicant) => void;
  onChangeAction: (applicant: Applicant, action: Applicant["action"]) => void;
}

export const ApplicantRow = ({
  applicant,
  onViewApplicant,
  onViewCoverLetter,
  onEditApplicant,
  onDeleteApplicant,
  onChangeAction
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
        <div>
          <div className="font-medium">{applicant.name}</div>
          <div className="text-sm text-gray-500">{applicant.email}</div>
        </div>
      </TableCell>
      <TableCell>{applicant.jobTitle}</TableCell>
      <TableCell>
        <div>
          <div className="flex flex-wrap gap-1 mb-1">
            {applicant.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-gray-500">
            Experience: {applicant.experience} | Education: {applicant.education}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {getActionBadge(applicant.action)}
      </TableCell>
      <TableCell className="text-right">
        <ApplicantActions 
          applicant={applicant}
          onViewApplicant={onViewApplicant}
          onViewCoverLetter={onViewCoverLetter}
          onEditApplicant={onEditApplicant}
          onDeleteApplicant={onDeleteApplicant}
          onChangeAction={onChangeAction}
        />
      </TableCell>
    </TableRow>
  );
};
