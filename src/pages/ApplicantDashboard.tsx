import { useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicantDashboardApplications } from "@/components/applicant/ApplicantDashboardApplications";
import { ApplicantDashboardCVGenerator } from "@/components/applicant/ApplicantDashboardCVGenerator";
import { ApplicantDashboardProfile } from "@/components/applicant/ApplicantDashboardProfile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApplicantDashboardFeedback } from "@/components/applicant/ApplicantDashboardFeedback";
import { ApplicantDashboardLinkedInImport } from "@/components/applicant/ApplicantDashboardLinkedInImport";
import { ApplicantDashboardInterviews } from "@/components/applicant/ApplicantDashboardInterviews";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("applications");
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-blue mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Applicant Dashboard</h1>
            <p className="text-gray-600">
              Track your applications and manage your job search
            </p>
          </div>

          <TooltipProvider>
            <Tabs defaultValue="applications" onValueChange={setActiveTab}>
              <TabsList className="mb-8 flex flex-wrap">
                <TabsTrigger value="applications">My Applications</TabsTrigger>
                <TabsTrigger value="interviews">Interviews & Recommendations</TabsTrigger>
                <TabsTrigger value="cv-generator">CV Generator</TabsTrigger>
                <TabsTrigger value="linkedin-import">LinkedIn Import</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              <TabsContent value="applications" className="animate-fade-in">
                <ApplicantDashboardApplications />
              </TabsContent>
              <TabsContent value="interviews" className="animate-fade-in">
                <ApplicantDashboardInterviews />
              </TabsContent>
              <TabsContent value="cv-generator" className="animate-fade-in">
                <ApplicantDashboardCVGenerator />
              </TabsContent>
              <TabsContent value="linkedin-import" className="animate-fade-in">
                <ApplicantDashboardLinkedInImport />
              </TabsContent>
              <TabsContent value="feedback" className="animate-fade-in">
                <ApplicantDashboardFeedback />
              </TabsContent>
              <TabsContent value="profile" className="animate-fade-in">
                <ApplicantDashboardProfile />
              </TabsContent>
            </Tabs>
          </TooltipProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicantDashboard;
