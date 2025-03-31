
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { mockJobs } from "@/data/mockJobs";
import { Building, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Company {
  name: string;
  logo?: string;
  jobCount: number;
}

const Companies = () => {
  // Extract unique companies from job data
  const companies: Company[] = Object.values(
    mockJobs.reduce((acc: Record<string, Company>, job) => {
      if (!acc[job.company]) {
        acc[job.company] = {
          name: job.company,
          logo: job.companyLogo,
          jobCount: 1,
        };
      } else {
        acc[job.company].jobCount += 1;
      }
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Discover top companies that are actively hiring on our platform.
            </p>
            <Link to="/dashboard">
              <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                Access Company Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.name} className="hover:border-brand-blue cursor-pointer transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={company.name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building size={32} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {company.jobCount} {company.jobCount === 1 ? 'job' : 'jobs'} available
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Link 
                      to={`/companies/${company.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-brand-blue hover:underline flex items-center"
                    >
                      <span>View Profile</span>
                      <ExternalLink size={16} className="ml-1" />
                    </Link>
                    
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companies;
