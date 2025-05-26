
import React from "react";
import { Applicant, ApplicationStatus } from "@/types/applicant";
import { ApplicantRow } from "./ApplicantRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ApplicantsTableProps {
  applicants: Applicant[];
  isLoading: boolean;
  error: string | null;
  selectedApplicants: string[];
  selectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleApplicantSelection: (applicantId: string) => void;
  onStatusChange: (applicantId: string, newStatus: ApplicationStatus) => Promise<void>;
  onDeleteApplicant: (applicantId: string) => Promise<void>;
  onViewApplicant: (applicant: Applicant) => void;
  onViewCoverLetter: (applicant: Applicant) => void;
  onMessageApplicant: (applicant: Applicant) => void;
  unreadCountsByApplication?: Record<string, number>;
}

export const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants,
  isLoading,
  error,
  selectedApplicants,
  selectAll,
  onToggleSelectAll,
  onToggleApplicantSelection,
  onStatusChange,
  onDeleteApplicant,
  onViewApplicant,
  onViewCoverLetter,
  onMessageApplicant,
  unreadCountsByApplication = {}
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.length > 0 ? (
            applicants.map((applicant) => (
              <ApplicantRow
                key={applicant.id}
                applicant={applicant}
                isSelected={selectedApplicants.includes(applicant.id)}
                onSelect={() => onToggleApplicantSelection(applicant.id)}
                onStatusChange={onStatusChange}
                onDelete={onDeleteApplicant}
                onViewApplicant={onViewApplicant}
                onViewCoverLetter={onViewCoverLetter}
                onMessageApplicant={onMessageApplicant}
                unreadMessageCount={unreadCountsByApplication[applicant.id] || 0}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No applicants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
