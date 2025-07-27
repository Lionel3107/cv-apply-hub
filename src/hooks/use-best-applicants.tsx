
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ApplicantWithScore } from "@/types/applicant";
import { toast } from "sonner";

interface ApplicantsByJob {
  jobId: string;
  jobTitle: string;
  applicants: ApplicantWithScore[];
}

export const useBestApplicants = () => {
  const [applicantsByJob, setApplicantsByJob] = useState<ApplicantsByJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchBestApplicants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated and has the right role
      if (!profile || !profile.company_id) {
        throw new Error("You must be an employer to view best applicants");
      }

      // First, get all jobs for this company
      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, description")
        .eq("company_id", profile.company_id);

      if (jobsError) {
        throw jobsError;
      }

      if (!jobs || jobs.length === 0) {
        setApplicantsByJob([]);
        return;
      }

      // For each job, get the applications with analysis data
      const jobsWithApplicants: ApplicantsByJob[] = [];

      for (const job of jobs) {
        // Fetch applications for this job
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select('id, name, email, applied_date, resume_url, cover_letter, score, feedback, skills, experience, education, updated_at')
          .eq('job_id', job.id)
          .order('applied_date', { ascending: false });

        if (applicationsError) {
          console.error(`Error fetching applications for job ${job.id}:`, applicationsError);
          continue;
        }

        if (!applications || applications.length === 0) {
          continue;
        }

        // Transform applications to applicants with score and analysis data
        const applicants: ApplicantWithScore[] = applications.map((app) => {
          // Parse feedback to extract strengths and improvements if available
          let strengths: string[] = [];
          let improvements: string[] = [];
          let recommendation = "Non analysé";

          console.log(`Application ${app.id} - Score: ${app.score}, Feedback:`, app.feedback);

          if (app.feedback) {
            try {
              // Try to parse feedback as JSON (if it contains analysis data)
              const feedbackData = JSON.parse(app.feedback);
              console.log(`Parsed feedback for ${app.id}:`, feedbackData);
              
              if (feedbackData.strengths) {
                strengths = Array.isArray(feedbackData.strengths) ? feedbackData.strengths : [];
              }
              if (feedbackData.improvements) {
                improvements = Array.isArray(feedbackData.improvements) ? feedbackData.improvements : [];
              }
              if (feedbackData.recommendation) {
                recommendation = feedbackData.recommendation;
              }
            } catch (e) {
              // If feedback is not JSON, treat it as plain text
              console.log("Feedback is not in JSON format, treating as plain text");
            }
          }

          const applicant = {
            id: app.id,
            name: app.name,
            email: app.email,
            jobTitle: job.title,
            appliedDate: app.applied_date,
            resumeUrl: app.resume_url || "",
            action: "new" as const, // Default status
            skills: app.skills || [],
            experience: app.experience || "",
            education: app.education || "",
            coverLetter: app.cover_letter || "",
            companyName: "",
            score: app.score || 0,
            strengths: strengths,
            improvements: improvements,
            recommendation: recommendation,
            feedback: app.feedback || "",
            updatedAt: app.updated_at,
            aiConsent: false, // Default to false for backward compatibility
            consentDate: null
          };

          console.log(`Processed applicant ${app.id}:`, {
            name: applicant.name,
            score: applicant.score,
            skills: applicant.skills,
            experience: applicant.experience,
            education: applicant.education,
            strengths: applicant.strengths,
            improvements: applicant.improvements
          });

          return applicant;
        });

        // Sort by score (highest first)
        applicants.sort((a, b) => b.score - a.score);

        jobsWithApplicants.push({
          jobId: job.id,
          jobTitle: job.title,
          applicants,
        });
      }

      setApplicantsByJob(jobsWithApplicants);
    } catch (err: any) {
      console.error("Error fetching best applicants:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error("Failed to load best applicants");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchBestApplicants();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
        },
        () => {
          // Refetch applicants when we receive a real-time update
          fetchBestApplicants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBestApplicants]);

  // Function to refresh data manually (useful after analysis)
  const refreshData = useCallback(() => {
    fetchBestApplicants();
  }, [fetchBestApplicants]);

  return { applicantsByJob, isLoading, error, refreshData };
};
