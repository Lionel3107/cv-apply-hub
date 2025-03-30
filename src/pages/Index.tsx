
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedJobs from "@/components/FeaturedJobs";
import CategorySection from "@/components/CategorySection";
import UploadCVSection from "@/components/UploadCVSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedJobs />
        <CategorySection />
        <UploadCVSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
