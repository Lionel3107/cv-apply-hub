
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import CompanySignupForm from "@/components/CompanySignupForm";

const CompanySignup = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in and has company account
    if (user && profile) {
      setIsLoading(false);
      
      // If the user already has a company account, redirect to dashboard
      if (profile.is_employer && profile.company_id) {
        navigate('/dashboard');
      }
      
      // If the user is not an employer account, redirect to applicant dashboard
      if (!profile.is_employer) {
        navigate('/applicant-dashboard');
      }
    } else if (!user) {
      // If no user is logged in, redirect to auth page
      navigate('/auth');
    } else {
      setIsLoading(false);
    }
  }, [user, profile, navigate]);

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Complete Your Company Profile</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Provide details about your company to create your employer profile. This information will be visible to job seekers.
              </p>
            </div>
            
            <CompanySignupForm onSuccess={handleSuccess} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanySignup;
