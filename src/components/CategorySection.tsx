
import { Card, CardContent } from "@/components/ui/card";
import { Code, Briefcase, PenTool, BarChart, Server, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const Category = ({ title, count, icon, color }: CategoryProps) => {
  return (
    <Link to={`/category/${title.toLowerCase()}`}>
      <Card className="job-card hover:border-brand-blue cursor-pointer">
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
  const categories = [
    { 
      title: "Technology", 
      count: 120, 
      icon: <Code size={24} className="text-white" />, 
      color: "bg-blue-500" 
    },
    { 
      title: "Business", 
      count: 75, 
      icon: <Briefcase size={24} className="text-white" />, 
      color: "bg-purple-500" 
    },
    { 
      title: "Design", 
      count: 53, 
      icon: <PenTool size={24} className="text-white" />, 
      color: "bg-pink-500" 
    },
    { 
      title: "Marketing", 
      count: 92, 
      icon: <BarChart size={24} className="text-white" />, 
      color: "bg-green-500" 
    },
    { 
      title: "Engineering", 
      count: 110, 
      icon: <Server size={24} className="text-white" />, 
      color: "bg-orange-500" 
    },
    { 
      title: "Sales", 
      count: 65, 
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
