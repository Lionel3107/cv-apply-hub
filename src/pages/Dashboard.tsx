
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyDashboardJobs } from "@/components/CompanyDashboardJobs";
import { CompanyDashboardInsights } from "@/components/CompanyDashboardInsights";
import { CompanyDashboardTasks } from "@/components/CompanyDashboardTasks";
import { CompanyDashboardSchedule } from "@/components/CompanyDashboardSchedule";
import { JobApplicantsView } from "@/components/JobApplicantsView";
import { Job } from "@/types/job";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
            <p className="text-gray-600">
              Manage your job listings, tasks, and schedule
            </p>
          </div>

          <Tabs defaultValue="jobs" onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
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
            <TabsContent value="tasks" className="animate-fade-in">
              <CompanyDashboardTasks />
            </TabsContent>
            <TabsContent value="schedule" className="animate-fade-in">
              <CompanyDashboardSchedule />
            </TabsContent>
            <TabsContent value="insights" className="animate-fade-in">
              <CompanyDashboardInsights />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
