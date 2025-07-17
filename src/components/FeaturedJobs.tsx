
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialDisplayCount = 3; // Show only 3 jobs initially
  
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from("jobs")
          .select(`
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
          `)
          .eq("is_featured", true)
          .order("posted_date", { ascending: false })
          .limit(initialDisplayCount);
        
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
        
        setFeaturedJobs(transformedJobs);
      } catch (err: unknown) {
        console.error("Error fetching featured jobs:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedJobs();
  }, []);
  
  const goToAllJobs = () => {
    navigate("/jobs");
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <p className="text-gray-600 mt-2">
              Discover opportunities from top companies
            </p>
          </div>
          <Button 
            onClick={goToAllJobs} 
            variant="ghost" 
            className="text-brand-blue hover:text-brand-darkBlue flex items-center gap-2"
          >
            View all jobs <ArrowRight size={16} />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
            <span className="ml-2 text-gray-600">Loading featured jobs...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={() => window.location.reload()} size="sm">Retry</Button>
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured jobs at the moment. Check back soon!</p>
            <Button onClick={goToAllJobs} className="mt-4">Browse All Jobs</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
