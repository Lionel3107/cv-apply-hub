
import { Card, CardContent } from "@/components/ui/card";
import { Code, Briefcase, PenTool, BarChart, Server, ShoppingBag, HardHat, Microscope, Landmark, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { categories, isLoading, error } = useCategories();

  // Map category names to icons and colors
  const getCategoryIcon = (name: string) => {
    const categoryIcons: Record<string, { icon: React.ReactNode; color: string }> = {
      "Technology": { icon: <Code size={24} className="text-white" />, color: "bg-blue-500" },
      "Business": { icon: <Briefcase size={24} className="text-white" />, color: "bg-purple-500" },
      "Design": { icon: <PenTool size={24} className="text-white" />, color: "bg-pink-500" },
      "Marketing": { icon: <BarChart size={24} className="text-white" />, color: "bg-green-500" },
      "Engineering": { icon: <Server size={24} className="text-white" />, color: "bg-orange-500" },
      "Sales": { icon: <ShoppingBag size={24} className="text-white" />, color: "bg-red-500" },
      "Construction": { icon: <HardHat size={24} className="text-white" />, color: "bg-yellow-500" },
      "Science": { icon: <Microscope size={24} className="text-white" />, color: "bg-indigo-500" },
      "Finance": { icon: <Landmark size={24} className="text-white" />, color: "bg-cyan-500" },
      "Healthcare": { icon: <HeartPulse size={24} className="text-white" />, color: "bg-emerald-500" },
    };

    return categoryIcons[name] || { 
      icon: <Briefcase size={24} className="text-white" />, 
      color: "bg-gray-500" 
    };
  };

  // Only display the first 3 categories
  const displayedCategories = categories.slice(0, 3);

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          <p className="text-gray-600 mt-2">
            Explore job opportunities by industry
          </p>
        </div>
        <Link to="/jobs">
          <Button 
            variant="ghost" 
            className="text-brand-blue hover:text-brand-darkBlue flex items-center gap-2"
          >
            View all categories <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 flex items-center">
                <Skeleton className="w-12 h-12 rounded-md mr-4" />
                <div>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category) => {
            const { icon, color } = getCategoryIcon(category.name);
            return (
              <Category 
                key={category.name}
                title={category.name}
                count={category.count}
                icon={icon}
                color={color}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
