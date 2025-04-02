
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ApplicantRow } from "./applicants/ApplicantRow";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { DeleteApplicantDialog } from "./applicants/DeleteApplicantDialog";
import { mockApplicants } from "@/data/mockApplicants";
import { Applicant } from "@/types/applicant";
import { Job } from "@/types/job";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

interface JobApplicantsViewProps {
  job: Job;
  onBack: () => void;
}

export const JobApplicantsView = ({ job, onBack }: JobApplicantsViewProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = React.useState(false);
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);

  // Filter mock applicants - in a real app, this would come from the API
  // For now, we'll just show all applicants for the demo
  const jobApplicants = mockApplicants.slice(0, Math.floor(Math.random() * 5) + 1);

  const handleDeleteClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedApplicant) {
      toast.success(`Applicant ${selectedApplicant.name} removed successfully`);
      setDeleteDialogOpen(false);
      setSelectedApplicant(null);
    }
  };

  const handleViewCoverLetter = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setCoverLetterDialogOpen(true);
  };

  const handleEditApplicant = (applicant: Applicant) => {
    // In a real app, this would open an edit form
    toast.info(`Edit applicant: ${applicant.name}`);
  };

  const handleViewApplicant = (applicant: Applicant) => {
    // In a real app, this would navigate to a detailed view
    toast.info(`Viewing applicant: ${applicant.name}`);
  };

  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Job Listings
      </Button>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{job.title} - Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{job.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Posted Date</p>
              <p className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium">{job.type}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Skills & Qualifications</TableHead>
              <TableHead>Ranking</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobApplicants.length > 0 ? (
              jobApplicants.map((applicant) => (
                <ApplicantRow
                  key={applicant.id}
                  applicant={applicant}
                  onViewApplicant={handleViewApplicant}
                  onViewCoverLetter={handleViewCoverLetter}
                  onEditApplicant={handleEditApplicant}
                  onDeleteApplicant={handleDeleteClick}
                />
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={5} className="text-center py-8">
                  No applicants yet for this job
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CoverLetterDialog
        open={coverLetterDialogOpen}
        onOpenChange={setCoverLetterDialogOpen}
        applicant={selectedApplicant}
      />

      <DeleteApplicantDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        applicant={selectedApplicant}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
