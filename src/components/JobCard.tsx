
import { Calendar, Briefcase, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="job-card bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="flex items-center gap-3">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-10 h-10 md:w-12 md:h-12 object-contain rounded"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded bg-gray-200 flex items-center justify-center text-gray-500">
              {job.company.charAt(0)}
            </div>
          )}
          
          <div>
            <Link to={`/jobs/${job.id}`}>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 hover:text-brand-blue line-clamp-2">
                {job.title}
              </h3>
            </Link>
            <p className="text-sm md:text-base text-gray-700">{job.company}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {job.featured && (
            <Badge className="bg-brand-blue hover:bg-brand-blue text-xs md:text-sm">Featured</Badge>
          )}
          {job.isRemote && (
            <Badge variant="outline" className="text-xs md:text-sm">Remote</Badge>
          )}
        </div>
      </div>
      
      {job.companyProfile?.website && (
        <div className="mt-3">
          <a 
            href={job.companyProfile.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-blue flex items-center text-xs md:text-sm hover:underline"
          >
            <Globe size={isMobile ? 12 : 14} className="mr-1" />
            Company Profile
          </a>
        </div>
      )}
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs md:text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin size={isMobile ? 14 : 16} className="mr-1 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center">
          <Briefcase size={isMobile ? 14 : 16} className="mr-1 flex-shrink-0" />
          <span className="truncate">{job.type}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={isMobile ? 14 : 16} className="mr-1 flex-shrink-0" />
          <span className="truncate">{job.postedDate}</span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.slice(0, isMobile ? 3 : 5).map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-gray-100 text-xs py-0.5">
            {tag}
          </Badge>
        ))}
        {job.tags.length > (isMobile ? 3 : 5) && (
          <Badge variant="secondary" className="bg-gray-100 text-xs py-0.5">
            +{job.tags.length - (isMobile ? 3 : 5)}
          </Badge>
        )}
      </div>
      
      <div className="mt-4">
        <Link to={`/jobs/${job.id}`}>
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className="w-full text-xs md:text-sm border-brand-blue text-brand-blue hover:bg-brand-blue/10"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
