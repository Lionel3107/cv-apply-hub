
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBestApplicants } from "@/hooks/use-best-applicants";
import { useCVAnalysis } from "@/hooks/use-cv-analysis";
import { ApplicantWithScore } from "@/types/applicant";
import { ApplicantProfileDialog } from "./applicants/ApplicantProfileDialog";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { BestApplicantsFilters } from "./best-applicants/BestApplicantsFilters";
import { BestApplicantsSummary } from "./best-applicants/BestApplicantsSummary";
import { JobApplicantsCard } from "./best-applicants/JobApplicantsCard";
import { NoApplicantsCard } from "./best-applicants/NoApplicantsCard";
import { LoadingStateDisplay } from "./best-applicants/LoadingStateDisplay";
import { ErrorStateDisplay } from "./best-applicants/ErrorStateDisplay";
import { DebugDataDisplay } from "./best-applicants/DebugDataDisplay";
import { TestAnalysisFunction } from "./best-applicants/TestAnalysisFunction";
import { EnvironmentCheck } from "./best-applicants/EnvironmentCheck";
import { DataVerificationTest } from "./best-applicants/DataVerificationTest";
import { Brain, Loader2, Bug, TestTube, Settings, Database } from "lucide-react";
import { toast } from "sonner";

export const CompanyDashboardBestApplicants = () => {
  const { applicantsByJob, isLoading, error, refreshData } = useBestApplicants();
  const { analyzeBulkCVs, isAnalyzing } = useCVAnalysis();
  
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("scoreDesc");
  const [limitCount, setLimitCount] = useState<number | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantWithScore | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showEnvCheck, setShowEnvCheck] = useState(false);
  const [showDataVerification, setShowDataVerification] = useState(false);
  
  React.useEffect(() => {
    // If this is the first render and we have jobs, expand the first one
    if (applicantsByJob.length > 0 && expandedJob === null) {
      setExpandedJob(applicantsByJob[0].jobId);
    }
  }, [applicantsByJob, expandedJob]);
  
  const handleToggleJob = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleAnalyzeJobApplicants = async (jobId: string) => {
    const job = applicantsByJob.find(j => j.jobId === jobId);
    if (!job) {
      toast.error("Poste non trouvé");
      return;
    }

    if (job.applicants.length === 0) {
      toast.error("Aucun candidat à analyser pour ce poste");
      return;
    }

    // Créer une description de poste basique si elle n'existe pas
    const jobDescription = `Poste: ${job.jobTitle}. Analysez les candidats pour ce poste.`;

    try {
      console.log(`Début de l'analyse pour ${job.applicants.length} candidats`);
      
      // Analyser chaque candidat individuellement et rafraîchir après chaque analyse
      for (const applicant of job.applicants) {
        console.log(`Analyse du candidat: ${applicant.name}`);
        
        const data = {
          applicationId: applicant.id,
          jobDescription,
          candidateData: {
            name: applicant.name,
            email: applicant.email,
            experience: applicant.experience || '',
            education: applicant.education || '',
            skills: applicant.skills || []
          }
        };
        
        const result = await analyzeBulkCVs([applicant], jobDescription);
        console.log(`Résultat analyse pour ${applicant.name}:`, result);
        
        // Rafraîchir immédiatement après chaque analyse
        await new Promise(resolve => setTimeout(resolve, 500));
        refreshData();
      }
      
      toast.success(`Analyse terminée pour ${job.applicants.length} candidat(s)`);
      
      // Rafraîchir une dernière fois après toutes les analyses
      setTimeout(() => {
        refreshData();
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast.error("Erreur lors de l'analyse des CV");
    }
  };
  
  const sortApplicants = (applicants: ApplicantWithScore[]) => {
    const sorted = [...applicants].sort((a, b) => {
      switch (sortBy) {
        case "scoreDesc":
          return b.score - a.score;
        case "scoreAsc":
          return a.score - b.score;
        case "experienceDesc":
          return (b.experience?.length || 0) - (a.experience?.length || 0);
        case "experienceAsc":
          return (a.experience?.length || 0) - (b.experience?.length || 0);
        case "skillsDesc":
          return (b.skills?.length || 0) - (a.skills?.length || 0);
        case "skillsAsc":
          return (a.skills?.length || 0) - (b.skills?.length || 0);
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "dateDesc":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case "dateAsc":
          return new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
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
        <div>
          <h2 className="text-xl font-bold">Meilleurs Candidats par Poste</h2>
          <p className="text-sm text-gray-600 mt-1">
            Classement basé sur l'analyse IA et les compétences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BestApplicantsFilters 
            sortBy={sortBy} 
            onSortChange={handleSort} 
            onLimitChange={handleLimit} 
          />
          {applicantsByJob.length > 0 && (
            <Button
              onClick={() => {
                const firstJob = applicantsByJob[0];
                if (firstJob) {
                  handleAnalyzeJobApplicants(firstJob.jobId);
                }
              }}
              disabled={isAnalyzing}
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyser tous les CV
                </>
              )}
            </Button>
          )}
          <Button
            onClick={() => setShowEnvCheck(!showEnvCheck)}
            variant="outline"
            size="sm"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
          >
            <Settings className="mr-2 h-4 w-4" />
            {showEnvCheck ? 'Masquer' : 'Config'}
          </Button>
          <Button
            onClick={() => setShowDebug(!showDebug)}
            variant="outline"
            size="sm"
            className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
          >
            <Bug className="mr-2 h-4 w-4" />
            {showDebug ? 'Masquer' : 'Déboguer'}
          </Button>
          <Button
            onClick={() => setShowTest(!showTest)}
            variant="outline"
            size="sm"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            <TestTube className="mr-2 h-4 w-4" />
            {showTest ? 'Masquer' : 'Tester'}
          </Button>
          <Button
            onClick={() => setShowDataVerification(!showDataVerification)}
            variant="outline"
            size="sm"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <Database className="mr-2 h-4 w-4" />
            {showDataVerification ? 'Masquer' : 'Vérifier'}
          </Button>
        </div>
      </div>
      
      {/* Vérification de l'environnement */}
      {showEnvCheck && <EnvironmentCheck />}
      
      {/* Vérification des données */}
      {showDataVerification && applicantsByJob.length > 0 && applicantsByJob[0].applicants.length > 0 && (
        <DataVerificationTest 
          applicationId={applicantsByJob[0].applicants[0].id}
          candidateName={applicantsByJob[0].applicants[0].name}
        />
      )}
      
      {/* Mode test Edge Function */}
      {showTest && applicantsByJob.length > 0 && applicantsByJob[0].applicants.length > 0 && (
        <TestAnalysisFunction 
          applicationId={applicantsByJob[0].applicants[0].id}
          candidateName={applicantsByJob[0].applicants[0].name}
          candidateEmail={applicantsByJob[0].applicants[0].email}
        />
      )}
      
      {/* Mode débogage */}
      {showDebug && applicantsByJob.length > 0 && (
        <DebugDataDisplay jobId={applicantsByJob[0].jobId} />
      )}
      
      {/* Résumé global des statistiques */}
      {applicantsByJob.length > 0 && (
        <BestApplicantsSummary applicantsByJob={applicantsByJob} />
      )}
      
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
            onAnalyzeApplicants={() => handleAnalyzeJobApplicants(job.jobId)}
            isAnalyzing={isAnalyzing}
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
