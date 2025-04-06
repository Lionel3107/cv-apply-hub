
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";

export const useCompanyJobs = (companyId?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<{
    id: string;
    name: string;
    logo?: string;
    description?: string;
    website?: string;
    location?: string;
    email?: string;
    phone?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setJobs([]);
      setCompany(null);
      setIsLoading(false);
      return;
    }

    const fetchCompanyJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, fetch the company details
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("id, name, logo_url, description, website, location, email, phone")
          .eq("id", companyId)
          .single();

        if (companyError) {
          throw companyError;
        }

        setCompany({
          id: companyData.id,
          name: companyData.name,
          logo: companyData.logo_url,
          description: companyData.description,
          website: companyData.website,
          location: companyData.location,
          email: companyData.email,
          phone: companyData.phone,
        });

        // Then fetch jobs by company using the function with proper typing
        const { data: jobsData, error: jobsError } = await supabase
          .rpc('get_company_jobs', { company_id_param: companyId }) as {
            data: Array<{
              id: string;
              title: string;
              company_name: string;
              company_logo: string | null;
              location: string;
              type: string;
              category: string;
              tags: string[];
              description: string;
              requirements: string[];
              benefits: string[];
              salary: string | null;
              posted_date: string;
              featured: boolean;
              is_remote: boolean;
            }> | null;
            error: any;
          };

        if (jobsError) {
          throw jobsError;
        }

        // Transform the data to match our Job type, handling null case
        const transformedJobs = jobsData ? jobsData.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company_name,
          companyLogo: job.company_logo || undefined,
          location: job.location,
          type: job.type,
          category: job.category,
          tags: job.tags,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits,
          salary: job.salary || undefined,
          postedDate: job.posted_date,
          featured: job.featured,
          isRemote: job.is_remote,
        })) : [];

        setJobs(transformedJobs);
      } catch (err: any) {
        console.error("Error fetching company jobs:", err);
        setError(err.message);
        toast.error("Failed to load company jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyJobs();
  }, [companyId]);

  return { jobs, company, isLoading, error };
};
