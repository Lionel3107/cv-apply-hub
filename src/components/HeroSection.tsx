
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    <div className="bg-gradient-to-br from-brand-blue to-brand-darkBlue py-28 px-4 overflow-hidden relative">
      {/* Background gradient circles for added depth */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl bottom-0 right-0"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Hire Better, Faster,<br className="hidden sm:block" /> More Efficiently
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
        >
          The intelligent recruitment platform that connects top talent with the right opportunities
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <form 
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search jobs, keywords, companies..."
                className="pl-10 h-14 bg-white text-gray-800 w-full rounded-full shadow-lg border-0 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="h-14 px-8 bg-white text-brand-darkBlue hover:bg-gray-100 rounded-full shadow-lg transition-all duration-200 md:w-auto w-full font-medium text-base"
            >
              Search Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-6 text-white/80">
            <span className="font-medium text-white">Popular: </span>
            <a href="/jobs?search=Software%20Engineer" className="hover:text-white hover:underline transition-colors">Software Engineer</a>
            <a href="/jobs?search=Product%20Manager" className="hover:text-white hover:underline transition-colors">Product Manager</a>
            <a href="/jobs?search=UX%20Designer" className="hover:text-white hover:underline transition-colors">UX Designer</a>
            <a href="/jobs?search=Marketing" className="hover:text-white hover:underline transition-colors">Marketing</a>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mt-12"
          >
            <div className="flex gap-3 items-center bg-white/10 rounded-full py-3 px-6 backdrop-blur-sm">
              <span className="text-white/80 text-sm">
                Trusted by 1,200+ companies worldwide
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
