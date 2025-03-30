
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { mockJobs } from "@/data/mockJobs";
import { Building } from "lucide-react";
import { Link } from "react-router-dom";

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
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover top companies that are actively hiring on our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link 
                to={`/companies/${company.name.toLowerCase().replace(/\s+/g, '-')}`} 
                key={company.name}
              >
                <Card className="hover:border-brand-blue cursor-pointer transition-all">
                  <CardContent className="p-6 flex items-center">
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companies;
