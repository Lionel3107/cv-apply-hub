
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Job } from "@/types/job";
import { useApplications } from "@/hooks/use-applications";
import { ApplicantProfileDialog } from "./applicants/ApplicantProfileDialog";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { DeleteApplicantDialog } from "./applicants/DeleteApplicantDialog";
import { MessageDialog } from "./applicants/MessageDialog";
import { exportApplicantsData } from "@/utils/exportUtils";
import { toast } from "sonner";
import { ApplicantFilters } from "./applicants/ApplicantFilters";
import { ApplicantsTable } from "./applicants/ApplicantsTable";
import { useApplicantManagement } from "@/hooks/use-applicant-management";
import { useCVAnalysis } from "@/hooks/use-cv-analysis";

interface JobApplicantsViewProps {
  job: Job;
  onBack: () => void;
}

export const JobApplicantsView: React.FC<JobApplicantsViewProps> = ({ job, onBack }) => {
  const { applications, isLoading, error } = useApplications(job.id);
  const { analyzeBulkCVs, isAnalyzing } = useCVAnalysis();
  
  const {
    selectedApplicants,
    selectAll,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    date,
    setDate,
    selectedApplicant,
    isProfileOpen,
    setIsProfileOpen,
    isCoverLetterOpen,
    setIsCoverLetterOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isMessageOpen,
    setIsMessageOpen,
    filteredApplicants,
    handleStatusChange,
    handleDeleteApplicant,
    toggleApplicantSelection,
    toggleSelectAll,
    handleViewApplicant,
    handleViewCoverLetter,
    handleMessageApplicant
  } = useApplicantManagement(applications);

  const handleExport = () => {
    if (applications) {
      exportApplicantsData(applications, job.title);
    } else {
      toast.error("No data to export.");
    }
  };

  const handleAnalyzeAll = async () => {
    if (applications && applications.length > 0) {
      await analyzeBulkCVs(applications, job.description);
    } else {
      toast.error("No applications to analyze.");
    }
  };

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Job Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Applicants for {job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicantFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            date={date}
            setDate={setDate}
            onExport={handleExport}
            onAnalyzeAll={handleAnalyzeAll}
            isAnalyzingAll={isAnalyzing}
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
            onDeleteApplicant={handleDeleteApplicant}
            onViewApplicant={handleViewApplicant}
            onViewCoverLetter={handleViewCoverLetter}
            onMessageApplicant={handleMessageApplicant}
            jobDescription={job.description}
          />
        </CardContent>
      </Card>
      
      {/* Applicant Profile Dialog */}
      <ApplicantProfileDialog 
        applicant={selectedApplicant} 
        open={isProfileOpen} 
        onOpenChange={setIsProfileOpen} 
      />
      
      {/* Cover Letter Dialog */}
      <CoverLetterDialog 
        applicant={selectedApplicant} 
        open={isCoverLetterOpen} 
        onOpenChange={setIsCoverLetterOpen} 
      />
      
      {/* Delete Applicant Dialog */}
      <DeleteApplicantDialog 
        applicant={selectedApplicant} 
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        onConfirmDelete={handleDeleteApplicant} 
      />
      
      {/* Message Dialog */}
      <MessageDialog 
        applicant={selectedApplicant} 
        open={isMessageOpen} 
        onOpenChange={setIsMessageOpen} 
      />
    </div>
  );
};
