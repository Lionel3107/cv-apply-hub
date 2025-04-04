
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";

export const useJobs = (companyId?: string | null) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase.from("jobs").select(`
          id,
          title,
          company_id,
          type,
          location,
          posted_date,
          is_featured,
          is_remote,
          description,
          requirements,
          benefits,
          salary,
          tags,
          category,
          companies (
            id,
            name,
            logo_url,
            website,
            email,
            phone,
            description
          )
        `);

        // If company ID is provided, filter by it
        if (companyId) {
          query = query.eq("company_id", companyId);
        } else if (profile?.is_employer && profile?.company_id) {
          // If user is an employer, show only their company's jobs
          query = query.eq("company_id", profile.company_id);
        }

        // Order by posted date, most recent first
        query = query.order("posted_date", { ascending: false });

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        // Transform the data to match our Job type
        const transformedJobs = data.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.companies?.name || "Unknown Company",
          companyLogo: job.companies?.logo_url,
          location: job.location,
          type: job.type,
          category: job.category,
          tags: job.tags || [],
          description: job.description,
          requirements: job.requirements || [],
          benefits: job.benefits || [],
          salary: job.salary,
          postedDate: job.posted_date,
          featured: job.is_featured,
          isRemote: job.is_remote,
          companyProfile: job.companies ? {
            website: job.companies.website,
            email: job.companies.email,
            phone: job.companies.phone,
            description: job.companies.description,
          } : undefined,
        }));

        setJobs(transformedJobs);
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
        toast.error("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
        },
        () => {
          // Refetch jobs when we receive a real-time update
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId, profile]);

  return { jobs, isLoading, error };
};
