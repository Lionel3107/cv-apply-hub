
import { Card, CardContent } from "@/components/ui/card";
import { Code, Briefcase, PenTool, BarChart, Server, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { mockJobs } from "@/data/mockJobs";

interface CategoryProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const Category = ({ title, count, icon, color }: CategoryProps) => {
  return (
    <Link to={`/category/${title.toLowerCase()}`}>
      <Card className="job-card hover:border-brand-blue cursor-pointer transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6 flex items-center">
          <div 
            className={`w-12 h-12 rounded-md flex items-center justify-center mr-4 ${color}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm">{count} jobs available</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const CategorySection = () => {
  // Calculate the actual number of jobs in each category
  const getCategoryCount = (categoryName: string) => {
    return mockJobs.filter(job => 
      job.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  const categories = [
    { 
      title: "Technology", 
      count: getCategoryCount("Technology"), 
      icon: <Code size={24} className="text-white" />, 
      color: "bg-blue-500" 
    },
    { 
      title: "Business", 
      count: getCategoryCount("Business"), 
      icon: <Briefcase size={24} className="text-white" />, 
      color: "bg-purple-500" 
    },
    { 
      title: "Design", 
      count: getCategoryCount("Design"), 
      icon: <PenTool size={24} className="text-white" />, 
      color: "bg-pink-500" 
    },
    { 
      title: "Marketing", 
      count: getCategoryCount("Marketing"), 
      icon: <BarChart size={24} className="text-white" />, 
      color: "bg-green-500" 
    },
    { 
      title: "Engineering", 
      count: getCategoryCount("Engineering"), 
      icon: <Server size={24} className="text-white" />, 
      color: "bg-orange-500" 
    },
    { 
      title: "Sales", 
      count: getCategoryCount("Sales"), 
      icon: <ShoppingBag size={24} className="text-white" />, 
      color: "bg-red-500" 
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore job opportunities by industry and find the perfect match for your career goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Category 
              key={category.title}
              title={category.title}
              count={category.count}
              icon={category.icon}
              color={category.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
