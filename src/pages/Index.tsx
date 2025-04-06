import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedJobs from "@/components/FeaturedJobs";
import CategorySection from "@/components/CategorySection";
import UploadCVSection from "@/components/UploadCVSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import StatsSection from "@/components/StatsSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturedJobs />
        <CategorySection />
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Seekers Card */}
            <div className="bg-gray-50 rounded-xl p-8 flex flex-col">
              <div className="mb-6 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-brand-blue" />
                </div>
                <h2 className="text-2xl font-bold">For Job Seekers</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Access your personalized dashboard to track applications and manage your job search.
              </p>
              {user ? (
                profile?.is_employer ? (
                  <p className="text-sm text-gray-500">You're registered as an employer.</p>
                ) : (
                  <Link to="/applicant-dashboard">
                    <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                      Go to Applicant Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )
              ) : (
                <Link to="/auth">
                  <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                    Sign In as Job Seeker
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Employers Card */}
            <div className="bg-gray-50 rounded-xl p-8 flex flex-col">
              <div className="mb-6 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Building className="h-6 w-6 text-brand-blue" />
                </div>
                <h2 className="text-2xl font-bold">For Employers</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Post jobs, manage applications, and find the perfect candidates for your company.
              </p>
              {user ? (
                profile?.is_employer ? (
                  <Link to="/dashboard">
                    <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                      Go to Company Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <p className="text-sm text-gray-500">You're registered as a job seeker.</p>
                )
              ) : (
                <Link to="/auth">
                  <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                    Sign In as Employer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <TestimonialsSection />
        <UploadCVSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
