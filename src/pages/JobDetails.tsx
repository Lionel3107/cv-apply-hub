
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobApplicationForm from "@/components/JobApplicationForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, MapPin, Calendar, DollarSign, Building, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockJobs } from "@/data/mockJobs";
import { Job } from "@/types/job";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const foundJob = mockJobs.find(j => j.id === id);
      
      if (foundJob) {
        setJob(foundJob);
      } else {
        // Job not found, redirect to homepage
        navigate("/");
      }
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-56 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!job) {
    return null; // Navigate will redirect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Details (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="md:flex justify-between items-start">
                  <div className="flex items-center mb-4 md:mb-0">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        className="w-16 h-16 object-contain rounded mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                        {job.company.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                      <p className="text-gray-700 mt-1">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.featured && (
                      <Badge className="bg-brand-blue hover:bg-brand-blue">Featured</Badge>
                    )}
                    {job.isRemote && (
                      <Badge variant="outline">Remote</Badge>
                    )}
                  </div>
                </div>
                
                {/* Job Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase size={18} className="mr-2" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building size={18} className="mr-2" />
                    <span>{job.category}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-2" />
                    <span>Posted {job.postedDate}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign size={18} className="mr-2" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  {job.isRemote && (
                    <div className="flex items-center text-gray-600">
                      <Globe size={18} className="mr-2" />
                      <span>Remote</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Apply Button (mobile only) */}
                <div className="mt-6 lg:hidden">
                  <Button 
                    className="w-full bg-brand-blue hover:bg-brand-darkBlue"
                    onClick={() => {
                      const applicationForm = document.getElementById('application-form');
                      if (applicationForm) {
                        applicationForm.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
              
              {/* Job Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
              </div>
              
              {/* Requirements */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
              
              {/* Benefits */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Application Form (1/3 width on desktop) */}
            <div className="lg:col-span-1" id="application-form">
              <div className="sticky top-24">
                <JobApplicationForm job={job} />
                
                {/* Company Card */}
                <Card className="mt-6 p-6">
                  <h3 className="text-lg font-semibold mb-4">About {job.company}</h3>
                  <p className="text-gray-700 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, 
                    eget aliquam nisl nisl sit amet nisl.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                  >
                    View Company Profile
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetails;
