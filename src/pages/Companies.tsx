import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/use-companies";
import { useAuth } from "@/contexts/AuthContext";

const Companies = () => {
  const { companies, isLoading, error } = useCompanies();
  const { user, profile } = useAuth();

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
            {user && profile?.is_employer && (
              <Link to="/dashboard">
                <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                  Access Company Dashboard
                </Button>
              </Link>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-md mr-4"></div>
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No companies found</h3>
              <p className="text-gray-600">
                There are no companies registered in the system yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card key={company.id} className="hover:border-brand-blue cursor-pointer transition-all">
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
                        to={`/companies/${company.id}`}
                        className="text-brand-blue hover:underline flex items-center"
                      >
                        <span>View Profile</span>
                        <ExternalLink size={16} className="ml-1" />
                      </Link>
                      
                      {user && profile?.is_employer && profile.company_id === company.id && (
                        <Link to="/dashboard">
                          <Button variant="outline" size="sm">
                            Dashboard
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companies;
