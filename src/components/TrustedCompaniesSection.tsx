import { motion } from "framer-motion";
import { ArrowRight, Upload, Search, UserCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your CV",
    description: "Simply upload your resume and let our AI analyze your skills and experience"
  },
  {
    icon: Search,
    title: "Find Perfect Matches",
    description: "Browse through curated job opportunities that match your profile"
  },
  {
    icon: UserCheck,
    title: "Get Hired",
    description: "Apply with confidence and land your dream job with our streamlined process"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How it Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in just three simple steps and transform your job search experience
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mb-6">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mt-8">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              
              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;