
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, ApplicantApplication, ApplicationStatus } from "@/types/applicant";
import { toast } from "sonner";

export const useApplications = (jobId?: string) => {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if user is authenticated and has the right role
        if (!profile) {
          throw new Error("You must be logged in to view applications");
        }

        let query = supabase.from("applications").select(`
          id,
          job_id,
          user_id,
          name,
          email,
          phone,
          resume_url,
          cover_letter,
          status,
          education,
          experience,
          skills,
          score,
          applied_date,
          jobs (
            id,
            title,
            companies (
              id,
              name,
              logo_url
            )
          )
        `);

        // If job ID is provided, filter applications for that job
        if (jobId) {
          query = query.eq("job_id", jobId);
        } else if (profile.is_employer && profile.company_id) {
          // For employers, show applications for all jobs in their company
          const { data: companyJobs } = await supabase
            .from("jobs")
            .select("id")
            .eq("company_id", profile.company_id);

          if (companyJobs && companyJobs.length > 0) {
            const jobIds = companyJobs.map(job => job.id);
            query = query.in("job_id", jobIds);
          }
        } else {
          // For applicants, show only their applications
          query = query.eq("user_id", profile.id);
        }

        // Order by application date, most recent first
        query = query.order("applied_date", { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        // Transform the data to match our Applicant type
        const transformedApplications = data.map((app) => ({
          id: app.id,
          name: app.name,
          email: app.email,
          userId: app.user_id, // Include userId for messaging
          jobTitle: app.jobs?.title || "Unknown Position",
          appliedDate: app.applied_date,
          resumeUrl: app.resume_url || "",
          action: validateApplicationStatus(app.status),
          skills: app.skills || [],
          experience: app.experience || "",
          education: app.education || "",
          coverLetter: app.cover_letter || "",
          companyName: app.jobs?.companies?.name || "Unknown Company",
          companyLogo: app.jobs?.companies?.logo_url,
          phone: app.phone,
        }));

        setApplications(transformedApplications);
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        setError(err.message);
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();

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
          // Refetch applications when we receive a real-time update
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, profile]);

  return { applications, isLoading, error };
};

export const useUserApplications = () => {
  const [applications, setApplications] = useState<ApplicantApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchUserApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("applications")
          .select(`
            id,
            job_id,
            status,
            applied_date,
            feedback,
            next_steps,
            jobs (
              id,
              title,
              companies (
                id,
                name,
                logo_url
              )
            )
          `)
          .eq("user_id", user.id)
          .order("applied_date", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        // Transform the data to match our ApplicantApplication type
        const transformedApplications = data.map((app) => ({
          id: app.id,
          jobId: app.job_id,
          jobTitle: app.jobs?.title || "Unknown Position",
          companyName: app.jobs?.companies?.name || "Unknown Company",
          companyLogo: app.jobs?.companies?.logo_url,
          appliedDate: app.applied_date,
          status: validateApplicationStatus(app.status),
          statusUpdates: [
            {
              status: validateApplicationStatus(app.status),
              date: app.applied_date,
            },
          ],
          feedback: app.feedback,
          nextSteps: app.next_steps,
        }));

        setApplications(transformedApplications);
      } catch (err: any) {
        console.error("Error fetching user applications:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserApplications();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch applications when we receive a real-time update
          fetchUserApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { applications, isLoading, error };
};

// Helper function to validate and type-cast application status
function validateApplicationStatus(status: string | null): ApplicationStatus {
  const validStatuses: ApplicationStatus[] = ["new", "shortlisted", "interviewed", "rejected", "hired"];
  
  // If the status is null or not a valid status, default to "new"
  if (!status || !validStatuses.includes(status as ApplicationStatus)) {
    return "new";
  }
  
  return status as ApplicationStatus;
}
