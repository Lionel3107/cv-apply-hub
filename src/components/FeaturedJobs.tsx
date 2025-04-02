
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { mockJobs } from "@/data/mockJobs";
import { ArrowRight } from "lucide-react";

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const featuredJobs = mockJobs.filter(job => job.featured);
  const initialDisplayCount = 3; // Show only 3 jobs initially
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.slice(0, initialDisplayCount).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
