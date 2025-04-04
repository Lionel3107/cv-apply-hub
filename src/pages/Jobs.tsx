
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
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
          .order("posted_date", { ascending: false });

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
        setFilteredJobs(transformedJobs);
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredJobs(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Jobs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Browse through all available job opportunities and find your perfect match.
            </p>
            
            <form 
              onSubmit={handleSearch}
              className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 mb-12"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search jobs, keywords, companies..."
                  className="pl-10 h-12 bg-white text-gray-800 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-brand-blue hover:bg-brand-darkBlue text-white">
                Search Jobs
              </Button>
            </form>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
              <span className="ml-2 text-gray-600">Loading jobs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading jobs</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              
              {filteredJobs.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs found</h3>
                  <p className="text-gray-600">
                    Please try different search terms or browse our categories.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
