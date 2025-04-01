
import { Applicant } from "@/types/applicant";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ApplicantActions } from "./ApplicantActions";
import { getStatusBadge, getRankingStars } from "@/utils/applicantUtils";

interface ApplicantRowProps {
  applicant: Applicant;
  onViewApplicant: (applicant: Applicant) => void;
  onViewCoverLetter: (applicant: Applicant) => void;
  onEditApplicant: (applicant: Applicant) => void;
  onDeleteApplicant: (applicant: Applicant) => void;
}

export const ApplicantRow = ({
  applicant,
  onViewApplicant,
  onViewCoverLetter,
  onEditApplicant,
  onDeleteApplicant
}: ApplicantRowProps) => {
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
        {getRankingStars(applicant.ranking)}
      </TableCell>
      <TableCell>
        {getStatusBadge(applicant.status)}
      </TableCell>
      <TableCell className="text-right">
        <ApplicantActions 
          applicant={applicant}
          onViewApplicant={onViewApplicant}
          onViewCoverLetter={onViewCoverLetter}
          onEditApplicant={onEditApplicant}
          onDeleteApplicant={onDeleteApplicant}
        />
      </TableCell>
    </TableRow>
  );
};
