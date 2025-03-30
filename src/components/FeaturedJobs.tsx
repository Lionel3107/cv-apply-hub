
import { useState } from "react";
import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/data/mockJobs";

const FeaturedJobs = () => {
  const [displayCount, setDisplayCount] = useState(6);
  const featuredJobs = mockJobs.filter(job => job.featured);
  
  const loadMoreJobs = () => {
    setDisplayCount(prev => prev + 6);
  };
  
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover opportunities from top companies that are actively hiring now.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredJobs.slice(0, displayCount).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      
      {displayCount < featuredJobs.length && (
        <div className="text-center mt-12">
          <Button 
            onClick={loadMoreJobs} 
            variant="outline" 
            className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            Load More Jobs
          </Button>
        </div>
      )}
    </section>
  );
};

export default FeaturedJobs;
