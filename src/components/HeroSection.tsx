
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="gradient-bg py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
          Find Your Dream Job Today
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto animate-slide-up">
          Browse thousands of job listings and upload your CV to apply instantly.
        </p>
        
        <form 
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 animate-slide-up" 
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search jobs, keywords, companies..."
              className="pl-10 h-12 bg-white text-gray-800 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-12 px-8 bg-brand-darkBlue hover:bg-brand-blue/90 text-white">
            Search Jobs
          </Button>
        </form>
        
        <div className="mt-8 text-white/80 flex flex-wrap justify-center gap-x-6 gap-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <span>Popular: </span>
          <a href="/jobs?search=Software%20Engineer" className="hover:text-white hover:underline">Software Engineer</a>
          <a href="/jobs?search=Product%20Manager" className="hover:text-white hover:underline">Product Manager</a>
          <a href="/jobs?search=UX%20Designer" className="hover:text-white hover:underline">UX Designer</a>
          <a href="/jobs?search=Marketing" className="hover:text-white hover:underline">Marketing</a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
