
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-brand-blue to-brand-darkBlue rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl -top-64 -right-64"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl bottom-0 left-0"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Hiring Process?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
              Join thousands of companies that are already using our platform to find the perfect candidates.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-brand-darkBlue hover:bg-gray-100 rounded-full px-8 py-6 h-auto text-lg shadow-lg">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" className="bg-white text-brand-darkBlue hover:bg-darkBlue-100 rounded-full px-8 py-6 h-auto text-lg shadow-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
