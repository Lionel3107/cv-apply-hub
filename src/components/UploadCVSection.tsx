
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

const UploadCVSection = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-brand-blue to-brand-darkBlue rounded-2xl p-10 md:p-16 shadow-lg relative overflow-hidden"
      >
        {/* Background decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl -bottom-32 -right-32"></div>
          <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 blur-2xl top-0 left-0"></div>
        </div>
        
        <div className="md:flex items-center justify-between relative z-10">
          <div className="mb-8 md:mb-0 md:mr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Accelerate Your Job Search
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Upload your CV once and apply to multiple jobs instantly. 
              Our AI will enhance your CV to make it stand out and match you with the perfect opportunities.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-white text-brand-blue hover:bg-gray-100 hover:text-brand-darkBlue rounded-full px-8 py-6 h-auto shadow-lg"
              onClick={() => document.getElementById("cv-upload")?.click()}
            >
              <FileUp className="mr-2" size={20} />
              Upload Your CV
            </Button>
            <input 
              id="cv-upload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default UploadCVSection;
