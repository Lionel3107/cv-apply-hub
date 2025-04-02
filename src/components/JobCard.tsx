
import { Calendar, Briefcase, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="job-card bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between items-start">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={`${job.company} logo`}
            className="w-12 h-12 object-contain rounded"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-500">
            {job.company.charAt(0)}
          </div>
        )}
        
        <div className="flex gap-2">
          {job.featured && (
            <Badge className="bg-brand-blue hover:bg-brand-blue">Featured</Badge>
          )}
          {job.isRemote && (
            <Badge variant="outline">Remote</Badge>
          )}
        </div>
      </div>
      
      <Link to={`/jobs/${job.id}`}>
        <h3 className="text-xl font-semibold mt-4 text-gray-900 hover:text-brand-blue">
          {job.title}
        </h3>
      </Link>
      
      <div className="flex items-center justify-between mt-1">
        <p className="text-gray-700">{job.company}</p>
        {job.companyProfile?.website && (
          <a 
            href={job.companyProfile.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-blue flex items-center text-sm hover:underline"
          >
            <Globe size={14} className="mr-1" />
            Company Profile
          </a>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin size={16} className="mr-1" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <Briefcase size={16} className="mr-1" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="mr-1" />
          <span>{job.postedDate}</span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="bg-gray-100">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="mt-5">
        <Link to={`/jobs/${job.id}`}>
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
