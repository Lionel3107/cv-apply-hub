
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ApplicantRow } from "./applicants/ApplicantRow";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { DeleteApplicantDialog } from "./applicants/DeleteApplicantDialog";
import { mockApplicants } from "@/data/mockApplicants";
import { Applicant } from "@/types/applicant";

export const CompanyDashboardApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const handleDeleteClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedApplicant) {
      setApplicants(applicants.filter(app => app.id !== selectedApplicant.id));
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Applicants Management</h2>
        <div>
          <Button size="sm" className="mr-2">
            Export List
          </Button>
          <Button size="sm">
            Filter Applicants
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Skills & Qualifications</TableHead>
              <TableHead>Ranking</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => (
              <ApplicantRow
                key={applicant.id}
                applicant={applicant}
                onViewApplicant={handleViewApplicant}
                onViewCoverLetter={handleViewCoverLetter}
                onEditApplicant={handleEditApplicant}
                onDeleteApplicant={handleDeleteClick}
              />
            ))}
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
