
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApplicantWithScore } from "@/types/applicant";
import { ApplicantScoreDisplay } from "./ApplicantScoreDisplay";
import { ApplicantSkillsBadges } from "./ApplicantSkillsBadges";
import { ApplicantActions } from "./ApplicantActions";

interface JobApplicantsCardProps {
  jobId: string;
  jobTitle: string;
  applicants: ApplicantWithScore[];
  isExpanded: boolean;
  onToggleExpand: (jobId: string) => void;
  onViewProfile: (applicant: ApplicantWithScore) => void;
  onViewCoverLetter: (applicant: ApplicantWithScore) => void;
  sortApplicants: (applicants: ApplicantWithScore[]) => ApplicantWithScore[];
}

export const JobApplicantsCard: React.FC<JobApplicantsCardProps> = ({
  jobId,
  jobTitle,
  applicants,
  isExpanded,
  onToggleExpand,
  onViewProfile,
  onViewCoverLetter,
  sortApplicants
}) => {
  return (
    <Card key={jobId} className="mb-4">
      <CardHeader 
        className="flex flex-row items-center justify-between py-3 cursor-pointer" 
        onClick={() => onToggleExpand(jobId)}
      >
        <CardTitle className="text-lg">{jobTitle}</CardTitle>
        <Button variant="ghost" size="icon">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Match Score</TableHead>
                  <TableHead>Key Skills</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortApplicants(applicants).map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={applicant.avatar} />
                          <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{applicant.name}</div>
                          <div className="text-sm text-gray-500">{applicant.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ApplicantScoreDisplay score={applicant.score} />
                    </TableCell>
                    <TableCell>
                      <ApplicantSkillsBadges skills={applicant.skills} />
                    </TableCell>
                    <TableCell>
                      {applicant.experience && applicant.experience.length > 50
                        ? `${applicant.experience.substring(0, 50)}...`
                        : applicant.experience || "Not specified"}
                    </TableCell>
                    <TableCell className="text-right">
                      <ApplicantActions
                        applicant={applicant}
                        onViewProfile={onViewProfile}
                        onViewCoverLetter={onViewCoverLetter}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
