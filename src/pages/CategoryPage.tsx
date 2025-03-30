
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { mockJobs } from "@/data/mockJobs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Format category name for display (capitalize first letter)
  const formattedCategory = category ? 
    category.charAt(0).toUpperCase() + category.slice(1) : 
    "";
  
  // Filter jobs by category
  const categoryJobs = mockJobs.filter(
    job => job.category.toLowerCase() === category?.toLowerCase()
  );
  
  const [filteredJobs, setFilteredJobs] = useState(categoryJobs);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filtered = categoryJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredJobs(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{formattedCategory} Jobs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Browse through all available {formattedCategory.toLowerCase()} jobs and find your perfect match.
            </p>
            
            <form 
              onSubmit={handleSearch}
              className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 mb-12"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder={`Search ${formattedCategory} jobs...`}
                  className="pl-10 h-12 bg-white text-gray-800 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-brand-blue hover:bg-brand-darkBlue text-white">
                Search Jobs
              </Button>
            </form>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            
            {filteredJobs.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No {formattedCategory} jobs found</h3>
                <p className="text-gray-600">
                  Please try different search terms or browse other categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
