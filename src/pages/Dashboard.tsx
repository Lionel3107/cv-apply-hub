import React, { useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyDashboardJobs } from "@/components/CompanyDashboardJobs";
import { CompanyDashboardInsights } from "@/components/CompanyDashboardInsights";
import { CompanyDashboardSchedule } from "@/components/CompanyDashboardSchedule";
import { CompanyDashboardBestApplicants } from "@/components/CompanyDashboardBestApplicants";
import { JobApplicantsView } from "@/components/JobApplicantsView";
import { Job } from "@/types/job";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/hooks/use-jobs";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { profile } = useAuth();
  const { jobs, isLoading } = useJobs(profile?.company_id);
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-blue mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
            <p className="text-gray-600">
              Manage your job listings, schedule, and view insights
            </p>
          </div>

          <TooltipProvider>
            <Tabs defaultValue="jobs" onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
                <TabsTrigger value="best-applicants">Best Applicants</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="jobs" className="animate-fade-in">
                {selectedJob ? (
                  <JobApplicantsView job={selectedJob} onBack={handleBackToJobs} />
                ) : (
                  <CompanyDashboardJobs onSelectJob={handleSelectJob} />
                )}
              </TabsContent>
              <TabsContent value="best-applicants" className="animate-fade-in">
                <CompanyDashboardBestApplicants />
              </TabsContent>
              <TabsContent value="schedule" className="animate-fade-in">
                <CompanyDashboardSchedule />
              </TabsContent>
              <TabsContent value="insights" className="animate-fade-in">
                <CompanyDashboardInsights />
              </TabsContent>
            </Tabs>
          </TooltipProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
