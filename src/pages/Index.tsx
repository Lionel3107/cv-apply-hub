
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedJobs from "@/components/FeaturedJobs";
import CategorySection from "@/components/CategorySection";
import UploadCVSection from "@/components/UploadCVSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import StatsSection from "@/components/StatsSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturedJobs />
        <CategorySection />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gray-50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Are you a job seeker?</h2>
              <p className="text-gray-600">
                Access your personalized dashboard to track applications and manage your job search.
              </p>
            </div>
            <Link to="/applicant-dashboard">
              <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                Go to Applicant Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
