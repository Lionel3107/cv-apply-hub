
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
        
        <div className="space-y-16">
          {screenshots.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              <div className="flex-1 max-w-2xl">
                <Card className="overflow-hidden shadow-2xl border-0">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.altText} 
                        className="w-full h-auto object-cover rounded-lg"
                        onError={(e) => { 
                          e.currentTarget.src = "/placeholder.svg"; 
                          e.currentTarget.alt = "Placeholder image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                <Button 
                  variant="outline" 
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
          
        <div className="mt-16 text-center">
          <Button className="rounded-full px-8 py-6 h-auto shadow-md bg-brand-blue hover:bg-brand-darkBlue text-white">
            Request a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AppShowcaseSection;
