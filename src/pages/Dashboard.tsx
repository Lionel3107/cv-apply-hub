
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyDashboardJobs } from "@/components/CompanyDashboardJobs";
import { CompanyDashboardInsights } from "@/components/CompanyDashboardInsights";
import { CompanyDashboardApplicants } from "@/components/CompanyDashboardApplicants";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
            <p className="text-gray-600">
              Manage your job listings and track applicant insights
            </p>
          </div>

          <Tabs defaultValue="jobs" onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
              <TabsTrigger value="applicants">Applicants</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
              <CompanyDashboardJobs />
            </TabsContent>
            <TabsContent value="applicants">
              <CompanyDashboardApplicants />
            </TabsContent>
            <TabsContent value="insights">
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
