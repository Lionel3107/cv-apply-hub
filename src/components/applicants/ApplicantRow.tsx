
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  FileText, 
  MessageSquare, 
  Trash2,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Applicant, ApplicationStatus } from "@/types/applicant";
import { format } from "date-fns";

interface ApplicantRowProps {
  applicant: Applicant;
  isSelected: boolean;
  onSelect: () => void;
  onStatusChange: (applicantId: string, newStatus: ApplicationStatus) => Promise<void>;
  onDelete: (applicantId: string) => Promise<void>;
  onViewApplicant: (applicant: Applicant) => void;
  onViewCoverLetter: (applicant: Applicant) => void;
  onMessageApplicant: (applicant: Applicant) => void;
  unreadMessageCount?: number;
}

const getStatusBadgeVariant = (status: ApplicationStatus) => {
  switch (status) {
    case 'new':
      return 'default';
    case 'reviewing':
      return 'secondary';
    case 'shortlisted':
      return 'default';
    case 'interview':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'hired':
      return 'default';
    default:
      return 'secondary';
  }
};

export const ApplicantRow: React.FC<ApplicantRowProps> = ({
  applicant,
  isSelected,
  onSelect,
  onStatusChange,
  onDelete,
  onViewApplicant,
  onViewCoverLetter,
  onMessageApplicant,
  unreadMessageCount = 0
}) => {
  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    await onStatusChange(applicant.id, newStatus);
  };

  return (
    <TableRow>
      <TableCell>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
      </TableCell>
      <TableCell className="font-medium">{applicant.name}</TableCell>
      <TableCell>{applicant.email}</TableCell>
      <TableCell>
        {format(new Date(applicant.appliedDate), "MMM d, yyyy")}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(applicant.status)}>
          {applicant.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessageApplicant(applicant)}
            className="relative"
          >
            <MessageSquare className="h-4 w-4" />
            {unreadMessageCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
              >
                {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewApplicant(applicant)}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewCoverLetter(applicant)}>
                <FileText className="mr-2 h-4 w-4" />
                Cover Letter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMessageApplicant(applicant)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('shortlisted')}
                disabled={applicant.status === 'shortlisted'}
              >
                Shortlist
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('interview')}
                disabled={applicant.status === 'interview'}
              >
                Schedule Interview
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('hired')}
                disabled={applicant.status === 'hired'}
              >
                Mark as Hired
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('rejected')}
                disabled={applicant.status === 'rejected'}
                className="text-red-600"
              >
                Reject
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(applicant.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
