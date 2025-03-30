
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PostJobForm } from "@/components/PostJobForm";

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJobPosted = () => {
    toast({
      title: "Job Posted Successfully",
      description: "Your job has been posted and is now live.",
    });
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post a Job</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your job opportunity with thousands of qualified candidates.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <PostJobForm onJobPosted={handleJobPosted} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
