
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

const UploadCVSection = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="bg-brand-blue rounded-xl p-8 md:p-12 shadow-lg">
        <div className="md:flex items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Accelerate Your Job Search
            </h2>
            <p className="text-white/90 text-lg">
              Upload your CV once and apply to multiple jobs instantly. 
              Get discovered by top companies looking for talent like you.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-white text-brand-blue hover:bg-gray-100 hover:text-brand-darkBlue"
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
      </div>
    </section>
  );
};

export default UploadCVSection;
