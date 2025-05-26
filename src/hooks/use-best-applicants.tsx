
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ApplicantWithScore, ApplicationStatus } from "@/types/applicant";
import { toast } from "sonner";

interface ApplicantsByJob {
  jobId: string;
  jobTitle: string;
  applicants: ApplicantWithScore[];
}

// Helper function to validate and type-cast application status
function validateApplicationStatus(status: string | null): ApplicationStatus {
  const validStatuses: ApplicationStatus[] = ["new", "reviewing", "shortlisted", "interviewed", "interview", "rejected", "hired"];
  
  // If the status is null or not a valid status, default to "new"
  if (!status || !validStatuses.includes(status as ApplicationStatus)) {
    return "new";
  }
  
  return status as ApplicationStatus;
}

export const useBestApplicants = () => {
  const [applicantsByJob, setApplicantsByJob] = useState<ApplicantsByJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchBestApplicants = async () => {
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
          .select("id, title")
          .eq("company_id", profile.company_id);

        if (jobsError) {
          throw jobsError;
        }

        if (!jobs || jobs.length === 0) {
          setApplicantsByJob([]);
          return;
        }

        // For each job, get the applications
        const jobsWithApplicants: ApplicantsByJob[] = [];

        for (const job of jobs) {
          const { data: applications, error: applicationsError } = await supabase
            .from("applications")
            .select(`
              id,
              job_id,
              name,
              email,
              phone,
              resume_url,
              cover_letter,
              education,
              experience,
              skills,
              score,
              status,
              applied_date,
              jobs (
                id,
                title
              )
            `)
            .eq("job_id", job.id);

          if (applicationsError) {
            console.error(`Error fetching applications for job ${job.id}:`, applicationsError);
            continue;
          }

          if (!applications || applications.length === 0) {
            continue;
          }

          // Transform applications to applicants with score
          const applicants: ApplicantWithScore[] = applications.map((app) => ({
            id: app.id,
            name: app.name,
            email: app.email,
            jobTitle: job.title,
            appliedDate: app.applied_date,
            resumeUrl: app.resume_url || "",
            status: validateApplicationStatus(app.status),
            action: validateApplicationStatus(app.status),
            skills: app.skills || [],
            experience: app.experience || "",
            education: app.education || "",
            coverLetter: app.cover_letter || "",
            companyName: "",
            score: app.score || Math.floor(Math.random() * 30) + 70, // If no score, generate random score between 70-100
          }));

          jobsWithApplicants.push({
            jobId: job.id,
            jobTitle: job.title,
            applicants,
          });
        }

        setApplicantsByJob(jobsWithApplicants);
      } catch (err: any) {
        console.error("Error fetching best applicants:", err);
        setError(err.message);
        toast.error("Failed to load best applicants");
      } finally {
        setIsLoading(false);
      }
    };

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
  }, [profile]);

  return { applicantsByJob, isLoading, error };
};
