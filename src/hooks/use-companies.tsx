
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  jobCount: number;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch companies
        const { data: companiesData, error: companiesError } = await supabase
          .from("companies")
          .select("*");

        if (companiesError) {
          throw companiesError;
        }

        // For each company, count the jobs
        const companiesWithJobCount = await Promise.all(
          companiesData.map(async (company) => {
            const { count, error: countError } = await supabase
              .from("jobs")
              .select("id", { count: "exact" })
              .eq("company_id", company.id);

            if (countError) {
              console.error("Error counting jobs for company:", countError);
              return {
                ...company,
                jobCount: 0,
              };
            }

            return {
              id: company.id,
              name: company.name,
              logo: company.logo_url,
              description: company.description,
              location: company.location,
              website: company.website,
              email: company.email,
              phone: company.phone,
              jobCount: count || 0,
            };
          })
        );

        setCompanies(companiesWithJobCount);
      } catch (err: any) {
        console.error("Error fetching companies:", err);
        setError(err.message);
        toast.error("Failed to load companies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, isLoading, error };
};
