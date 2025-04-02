
import { Users, Briefcase, Building, Award } from "lucide-react";

const stats = [
  {
    value: "10K+",
    label: "Active Users",
    icon: <Users className="h-6 w-6" />,
  },
  {
    value: "5K+",
    label: "Job Listings",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    value: "1.2K+",
    label: "Companies",
    icon: <Building className="h-6 w-6" />,
  },
  {
    value: "98%",
    label: "Success Rate",
    icon: <Award className="h-6 w-6" />,
  },
];

const StatsSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-brand-blue/10 p-3 rounded-full mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
