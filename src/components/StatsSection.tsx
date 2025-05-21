
import { motion } from "framer-motion";
import { Users, Briefcase, Building, Award } from "lucide-react";

const stats = [
  {
    value: "10K+",
    label: "Active Users",
    icon: <Users className="h-6 w-6 text-brand-blue" />,
  },
  {
    value: "5K+",
    label: "Job Listings",
    icon: <Briefcase className="h-6 w-6 text-brand-blue" />,
  },
  {
    value: "1.2K+",
    label: "Companies",
    icon: <Building className="h-6 w-6 text-brand-blue" />,
  },
  {
    value: "98%",
    label: "Success Rate",
    icon: <Award className="h-6 w-6 text-brand-blue" />,
  },
];

const StatsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-10 -mt-20 relative z-10 border border-gray-100"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="bg-brand-blue/10 p-4 rounded-full mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
