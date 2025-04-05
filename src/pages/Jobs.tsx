
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Filter } from "lucide-react";
import { useJobFilters } from "@/hooks/use-job-filters";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/use-categories";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategories();
  const { filters, setFilter, resetFilters } = useJobFilters();
  
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

  useEffect(() => {
    let result = [...jobs];

    // Apply text search filter
    if (searchTerm) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(job => job.category === filters.category);
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter(job => job.type === filters.type);
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply remote filter
    if (filters.isRemote !== null) {
      result = result.filter(job => job.isRemote === filters.isRemote);
    }

    setFilteredJobs(result);
  }, [searchTerm, jobs, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const uniqueTypes = [...new Set(jobs.map(job => job.type))];
  const uniqueLocations = [...new Set(jobs.map(job => job.location))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All Jobs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Browse through all available job opportunities and find your perfect match.
            </p>
            
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-12 px-4">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter Jobs</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuLabel className="text-xs font-semibold text-gray-500 mt-2">Category</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className={!filters.category ? "bg-gray-100" : ""} 
                        onClick={() => setFilter('category', '')}
                      >
                        All Categories
                      </DropdownMenuItem>
                      {categories.map(category => (
                        <DropdownMenuItem 
                          key={category.name}
                          className={filters.category === category.name ? "bg-gray-100" : ""}
                          onClick={() => setFilter('category', category.name)}
                        >
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuLabel className="text-xs font-semibold text-gray-500 mt-2">Job Type</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className={!filters.type ? "bg-gray-100" : ""} 
                        onClick={() => setFilter('type', '')}
                      >
                        All Types
                      </DropdownMenuItem>
                      {uniqueTypes.map(type => (
                        <DropdownMenuItem 
                          key={type}
                          className={filters.type === type ? "bg-gray-100" : ""}
                          onClick={() => setFilter('type', type)}
                        >
                          {type}
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuLabel className="text-xs font-semibold text-gray-500 mt-2">Location</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className={!filters.location ? "bg-gray-100" : ""} 
                        onClick={() => setFilter('location', '')}
                      >
                        All Locations
                      </DropdownMenuItem>
                      {uniqueLocations.slice(0, 5).map(location => (
                        <DropdownMenuItem 
                          key={location}
                          className={filters.location === location ? "bg-gray-100" : ""}
                          onClick={() => setFilter('location', location)}
                        >
                          {location}
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuLabel className="text-xs font-semibold text-gray-500 mt-2">Remote</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className={filters.isRemote === null ? "bg-gray-100" : ""} 
                        onClick={() => setFilter('isRemote', null)}
                      >
                        All Jobs
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={filters.isRemote === true ? "bg-gray-100" : ""} 
                        onClick={() => setFilter('isRemote', true)}
                      >
                        Remote Only
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={filters.isRemote === false ? "bg-gray-100" : ""} 
                        onClick={() => setFilter('isRemote', false)}
                      >
                        On-site Only
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={resetFilters}>
                        Reset All Filters
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {Object.values(filters).some(value => value !== '' && value !== null) && (
              <div className="max-w-5xl mx-auto mb-6 flex flex-wrap gap-2 justify-center">
                {filters.category && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setFilter('category', '')}
                  >
                    Category: {filters.category} ×
                  </Button>
                )}
                
                {filters.type && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setFilter('type', '')}
                  >
                    Type: {filters.type} ×
                  </Button>
                )}
                
                {filters.location && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setFilter('location', '')}
                  >
                    Location: {filters.location} ×
                  </Button>
                )}
                
                {filters.isRemote !== null && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setFilter('isRemote', null)}
                  >
                    {filters.isRemote ? 'Remote Only' : 'On-site Only'} ×
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs text-gray-500"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              </div>
            )}
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
