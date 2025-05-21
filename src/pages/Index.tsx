
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AppShowcaseSection from "@/components/AppShowcaseSection";
import UploadCVSection from "@/components/UploadCVSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import StatsSection from "@/components/StatsSection";
import CtaSection from "@/components/CtaSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <AppShowcaseSection />
        
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Tailored for Everyone</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Job Seekers Card */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="mb-6 flex items-center">
                  <div className="bg-brand-blue/10 p-4 rounded-xl mr-4">
                    <User className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h2 className="text-2xl font-bold">For Job Seekers</h2>
                </div>
                <p className="text-gray-600 mb-8 flex-grow">
                  Access your personalized dashboard to track applications, receive job recommendations, and manage your career journey all in one place.
                </p>
                {user ? (
                  profile?.is_employer ? (
                    <p className="text-sm text-gray-500">You're registered as an employer.</p>
                  ) : (
                    <Link to="/applicant-dashboard">
                      <Button className="bg-brand-blue hover:bg-brand-darkBlue rounded-full w-full">
                        Go to Applicant Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )
                ) : (
                  <Link to="/auth">
                    <Button className="bg-brand-blue hover:bg-brand-darkBlue rounded-full w-full">
                      Sign In as Job Seeker
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Employers Card */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="mb-6 flex items-center">
                  <div className="bg-brand-blue/10 p-4 rounded-xl mr-4">
                    <Building className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h2 className="text-2xl font-bold">For Employers</h2>
                </div>
                <p className="text-gray-600 mb-8 flex-grow">
                  Post jobs, manage applications, and leverage our AI-powered tools to find the perfect candidates for your organization with minimal effort.
                </p>
                {user ? (
                  profile?.is_employer ? (
                    <Link to="/dashboard">
                      <Button className="bg-brand-blue hover:bg-brand-darkBlue rounded-full w-full">
                        Go to Company Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-500">You're registered as a job seeker.</p>
                  )
                ) : (
                  <Link to="/auth">
                    <Button className="bg-brand-blue hover:bg-brand-darkBlue rounded-full w-full">
                      Sign In as Employer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <TestimonialsSection />
        <UploadCVSection />
        <CtaSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
