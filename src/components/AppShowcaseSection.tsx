
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const screenshots = [
  {
    title: "AI-Powered Dashboard",
    description: "Analyze candidate data with our intuitive dashboard",
    image: "/dashboard-screenshot.png", // Placeholder image
    altText: "ATS dashboard with analytics charts and candidate metrics"
  },
  {
    title: "CV Parsing & Analysis",
    description: "Automatically extract and rank candidate information",
    image: "/cv-parsing-screenshot.png", // Placeholder image
    altText: "CV parsing interface with highlighted skills and experience"
  },
  {
    title: "Applicant Tracking",
    description: "Monitor applications through every stage of the hiring process",
    image: "/applicant-tracking-screenshot.png", // Placeholder image
    altText: "Kanban board showing candidate progress through hiring stages"
  },
  {
    title: "Interview Scheduling",
    description: "Seamlessly schedule interviews with candidates",
    image: "/scheduling-screenshot.png", // Placeholder image
    altText: "Calendar interface for scheduling candidate interviews"
  }
];

const AppShowcaseSection = () => {
  return (
    <section className="py-16 container mx-auto px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">See Our Platform in Action</h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Explore the intuitive interfaces and powerful features that make recruiting simpler and more effective
            </p>
          </div>
          <Link to="/features" className="mt-4 md:mt-0">
            <Button 
              variant="ghost" 
              className="text-brand-blue hover:text-brand-darkBlue flex items-center gap-2"
            >
              View all features <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Carousel className="w-full">
            <CarouselContent>
              {screenshots.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <motion.div 
                      className="rounded-xl overflow-hidden border border-gray-100 shadow-md bg-white h-full flex flex-col"
                      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative pt-[60%]">
                        <img 
                          src={item.image} 
                          alt={item.altText} 
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { 
                            e.currentTarget.src = "/placeholder.svg"; 
                            e.currentTarget.alt = "Placeholder image";
                          }}
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 -mt-12" />
            <CarouselNext className="right-2 -mt-12" />
          </Carousel>
          
          <div className="mt-10 text-center">
            <Button className="rounded-full px-8 py-6 h-auto shadow-md bg-brand-blue hover:bg-brand-darkBlue text-white">
              Request a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppShowcaseSection;
