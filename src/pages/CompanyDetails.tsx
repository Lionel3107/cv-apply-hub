
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { useCompanyJobs } from "@/hooks/use-company-jobs";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Mail, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs, company, isLoading, error } = useCompanyJobs(id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/companies" className="inline-flex items-center text-brand-blue hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
              <span className="ml-2 text-gray-600">Loading company details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading company</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : company ? (
            <>
              <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-400">
                        {company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {company.website && (
                        <a 
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-brand-blue hover:underline"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                    
                    {company.description && (
                      <p className="text-gray-600 mb-6">{company.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Jobs at {company.name}
                </h2>
                
                {jobs.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs available</h3>
                    <p className="text-gray-600">
                      This company doesn't have any job openings at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Company not found</h3>
              <p className="text-gray-600 mb-4">
                The company you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/companies">
                <Button>Browse All Companies</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDetails;
