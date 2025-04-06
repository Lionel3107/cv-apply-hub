
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useBestApplicants } from "@/hooks/use-best-applicants";
import { ApplicantWithScore } from "@/types/applicant";
import { ApplicantProfileDialog } from "./applicants/ApplicantProfileDialog";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { BestApplicantsFilters } from "./best-applicants/BestApplicantsFilters";
import { JobApplicantsCard } from "./best-applicants/JobApplicantsCard";
import { NoApplicantsCard } from "./best-applicants/NoApplicantsCard";
import { LoadingStateDisplay } from "./best-applicants/LoadingStateDisplay";
import { ErrorStateDisplay } from "./best-applicants/ErrorStateDisplay";

export const CompanyDashboardBestApplicants = () => {
  const { applicantsByJob, isLoading, error } = useBestApplicants();
  
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("scoreDesc");
  const [limitCount, setLimitCount] = useState<number | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantWithScore | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  
  React.useEffect(() => {
    // If this is the first render and we have jobs, expand the first one
    if (applicantsByJob.length > 0 && expandedJob === null) {
      setExpandedJob(applicantsByJob[0].jobId);
    }
  }, [applicantsByJob, expandedJob]);
  
  const handleToggleJob = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };
  
  const sortApplicants = (applicants: ApplicantWithScore[]) => {
    const sorted = [...applicants].sort((a, b) => {
      switch (sortBy) {
        case "scoreDesc":
          return b.score - a.score;
        case "scoreAsc":
          return a.score - b.score;
        case "experienceDesc":
          return b.experience.localeCompare(a.experience);
        case "nameAsc":
          return a.name.localeCompare(b.name);
        default:
          return b.score - a.score;
      }
    });
    
    if (limitCount) {
      return sorted.slice(0, limitCount);
    }
    
    return sorted;
  };
  
  const handleSort = (value: string) => {
    setSortBy(value);
  };

  const handleLimit = (value: string) => {
    setLimitCount(value === "all" ? null : parseInt(value));
  };
  
  const handleViewProfile = (applicant: ApplicantWithScore) => {
    setSelectedApplicant(applicant);
    setIsProfileOpen(true);
  };
  
  const handleViewCoverLetter = (applicant: ApplicantWithScore) => {
    setSelectedApplicant(applicant);
    setIsCoverLetterOpen(true);
  };
  
  if (isLoading) {
    return <LoadingStateDisplay />;
  }
  
  if (error) {
    return <ErrorStateDisplay error={error} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-bold">Best Applicants by Job</h2>
        <BestApplicantsFilters 
          sortBy={sortBy} 
          onSortChange={handleSort} 
          onLimitChange={handleLimit} 
        />
      </div>
      
      {applicantsByJob.length === 0 ? (
        <NoApplicantsCard />
      ) : (
        applicantsByJob.map((job) => (
          <JobApplicantsCard
            key={job.jobId}
            jobId={job.jobId}
            jobTitle={job.jobTitle}
            applicants={job.applicants}
            isExpanded={expandedJob === job.jobId}
            onToggleExpand={handleToggleJob}
            onViewProfile={handleViewProfile}
            onViewCoverLetter={handleViewCoverLetter}
            sortApplicants={sortApplicants}
          />
        ))
      )}
      
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
    </div>
  );
};
