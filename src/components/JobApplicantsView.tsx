
import React, { useState } from "react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/use-applications";
import { useApplicantManagement } from "@/hooks/use-applicant-management";
import { useUnreadMessagesByApplication } from "@/hooks/use-unread-messages-by-application";
import { ApplicantsTable } from "@/components/applicants/ApplicantsTable";
import { ApplicantActions } from "@/components/applicants/ApplicantActions";
import { ApplicantFilters } from "@/components/applicants/ApplicantFilters";
import { ApplicantProfileDialog } from "@/components/applicants/ApplicantProfileDialog";
import { CoverLetterDialog } from "@/components/applicants/CoverLetterDialog";
import { MessageDialog } from "@/components/applicants/MessageDialog";
import { DeleteApplicantDialog } from "@/components/applicants/DeleteApplicantDialog";
import { Applicant } from "@/types/applicant";
import { Separator } from "@/components/ui/separator";

interface JobApplicantsViewProps {
  job: Job;
  onBack: () => void;
}

export const JobApplicantsView = ({ job, onBack }: JobApplicantsViewProps) => {
  // First fetch the applications data
  const { applications, isLoading, error } = useApplications(job.id);
  
  // Then use the management hook with the fetched data
  const applicantManagement = useApplicantManagement(applications);
  
  // Destructure the hook properties properly
  const {
    selectedApplicants,
    selectAll,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    toggleSelectAll,
    toggleApplicantSelection,
    filteredApplicants,
    handleStatusChange,
    handleDeleteApplicant,
    handleViewApplicant,
    handleViewCoverLetter,
    handleMessageApplicant
  } = applicantManagement;

  const unreadCountsByApplication = useUnreadMessagesByApplication();

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleViewApplicantWrapper = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsProfileOpen(true);
  };

  const handleViewCoverLetterWrapper = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsCoverLetterOpen(true);
  };

  const handleMessageApplicantWrapper = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsMessageOpen(true);
  };

  const handleDeleteApplicantWrapper = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsDeleteOpen(true);
  };

  const confirmDeleteApplicant = async () => {
    if (selectedApplicant) {
      await handleDeleteApplicant(selectedApplicant.id);
      setIsDeleteOpen(false);
      setSelectedApplicant(null);
    }
  };

  // Mock functions for features not yet implemented
  const mockBulkUpdateStatus = async () => {
    console.log("Bulk status update not implemented yet");
  };

  const mockBulkDeleteApplicants = async () => {
    console.log("Bulk delete not implemented yet");
  };

  const mockExportApplicants = async () => {
    console.log("Export not implemented yet");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-gray-600">Manage applicants for this position</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applicants ({filteredApplicants.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApplicantFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          <Separator />
          
          <ApplicantActions
            selectedCount={selectedApplicants.length}
            onBulkStatusUpdate={mockBulkUpdateStatus}
            onBulkDelete={mockBulkDeleteApplicants}
            onExport={mockExportApplicants}
          />

          <ApplicantsTable
            applicants={filteredApplicants}
            isLoading={isLoading}
            error={error}
            selectedApplicants={selectedApplicants}
            selectAll={selectAll}
            onToggleSelectAll={toggleSelectAll}
            onToggleApplicantSelection={toggleApplicantSelection}
            onStatusChange={handleStatusChange}
            onDeleteApplicant={async (id) => {
              const applicant = applications.find(a => a.id === id);
              if (applicant) handleDeleteApplicantWrapper(applicant);
            }}
            onViewApplicant={handleViewApplicantWrapper}
            onViewCoverLetter={handleViewCoverLetterWrapper}
            onMessageApplicant={handleMessageApplicantWrapper}
            unreadCountsByApplication={unreadCountsByApplication}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ApplicantProfileDialog
        applicant={selectedApplicant}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />

      <CoverLetterDialog
        applicant={selectedApplicant}
        open={isCoverLetterOpen}
        onOpenChange={setIsCoverLetterOpen}
      />

      <MessageDialog
        applicant={selectedApplicant}
        open={isMessageOpen}
        onOpenChange={setIsMessageOpen}
      />

      <DeleteApplicantDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDeleteApplicant}
        applicantName={selectedApplicant?.name || ""}
      />
    </div>
  );
};
