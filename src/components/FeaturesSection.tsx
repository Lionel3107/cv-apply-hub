
import { motion } from "framer-motion";
import { 
  FileSearch, 
  FileUp, 
  MessageCircle, 
  LayoutDashboard, 
  Bell 
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
  >
    <div className="bg-brand-blue/10 text-brand-blue p-3 rounded-xl w-14 h-14 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <FileSearch className="h-8 w-8" />,
      title: "AI CV Parsing & Ranking",
      description: "Our advanced AI instantly extracts and ranks candidate information to help you find the perfect match."
    },
    {
      icon: <FileUp className="h-8 w-8" />,
      title: "CV Generation & Enhancement",
      description: "Create professional CVs with AI assistance or optimize existing ones for better job matching."
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Real-time Messaging",
      description: "Connect recruiters and applicants instantly through our secure real-time messaging platform."
    },
    {
      icon: <LayoutDashboard className="h-8 w-8" />,
      title: "Recruiter Dashboard",
      description: "Powerful analytics and filtering tools to help recruiters manage candidates efficiently."
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Applicant Tracking",
      description: "Applicants can track their application status with real-time notifications and updates."
    }
  ];

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features to Streamline Your Hiring</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with intuitive tools
            to create the most efficient recruitment process possible.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
