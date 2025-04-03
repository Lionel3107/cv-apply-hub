
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ApplicantRow } from "./applicants/ApplicantRow";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { DeleteApplicantDialog } from "./applicants/DeleteApplicantDialog";
import { ApplicantProfileDialog } from "./applicants/ApplicantProfileDialog";
import { mockApplicants } from "@/data/mockApplicants";
import { Applicant } from "@/types/applicant";
import { Job } from "@/types/job";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobApplicantsViewProps {
  job: Job;
  onBack: () => void;
}

interface ApplicantMessage {
  id: string;
  applicantId: string;
  message: string;
  date: string;
  status: "sent" | "read";
}

export const JobApplicantsView = ({ job, onBack }: JobApplicantsViewProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [jobApplicants, setJobApplicants] = useState<Applicant[]>(
    mockApplicants.slice(0, Math.floor(Math.random() * 5) + 1)
  );

  // Message feature states
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [applicantMessages, setApplicantMessages] = useState<ApplicantMessage[]>([]);
  
  // Interview tab state
  const [activeTab, setActiveTab] = useState("applicants");
  // Get interviewed applicants
  const interviewedApplicants = jobApplicants.filter(
    applicant => applicant.action === "interviewed" || applicant.action === "shortlisted"
  );

  const handleDeleteClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedApplicant) {
      setJobApplicants(jobApplicants.filter(app => app.id !== selectedApplicant.id));
      toast.success(`Applicant ${selectedApplicant.name} removed successfully`);
      setDeleteDialogOpen(false);
      setSelectedApplicant(null);
    }
  };

  const handleViewCoverLetter = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setCoverLetterDialogOpen(true);
  };

  const handleEditApplicant = (applicant: Applicant) => {
    // In a real app, this would open an edit form
    toast.info(`Edit applicant: ${applicant.name}`);
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setProfileDialogOpen(true);
  };
  
  const handleChangeAction = (applicant: Applicant, action: Applicant["action"]) => {
    const updatedApplicants = jobApplicants.map(app => 
      app.id === applicant.id ? { ...app, action } : app
    );
    setJobApplicants(updatedApplicants);
    
    const actionMessages = {
      new: "marked as new",
      shortlisted: "shortlisted",
      interviewed: "marked as interviewed",
      rejected: "rejected",
      hired: "hired"
    };
    
    toast.success(`Applicant ${applicant.name} ${actionMessages[action]}`);
  };
  
  // Handle messaging applicant
  const handleMessageApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setMessageDialogOpen(true);
  };
  
  const handleSendMessage = () => {
    if (!selectedApplicant || newMessage.trim() === "") return;
    
    const message: ApplicantMessage = {
      id: Date.now().toString(),
      applicantId: selectedApplicant.id,
      message: newMessage,
      date: new Date().toISOString(),
      status: "sent"
    };
    
    setApplicantMessages([...applicantMessages, message]);
    setNewMessage("");
    setMessageDialogOpen(false);
    
    toast.success(`Message sent to ${selectedApplicant.name}`);
  };
  
  // Handle scheduling interview
  const handleScheduleInterview = (applicant: Applicant) => {
    toast.success(`Interview scheduled with ${applicant.name}`);
  };

  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Job Listings
      </Button>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{job.title} - Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{job.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Posted Date</p>
              <p className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium">{job.type}</p>
            </div>
          </div>
          
          {job.companyProfile && (
            <div className="mt-4 border-t pt-4">
              <p className="font-medium mb-2">Company Profile</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.companyProfile.website && (
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={job.companyProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline"
                    >
                      {job.companyProfile.website}
                    </a>
                  </div>
                )}
                {job.companyProfile.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href={`mailto:${job.companyProfile.email}`}
                      className="text-brand-blue hover:underline"
                    >
                      {job.companyProfile.email}
                    </a>
                  </div>
                )}
                {job.companyProfile.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{job.companyProfile.phone}</p>
                  </div>
                )}
              </div>
              {job.companyProfile.description && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">About the Company</p>
                  <p className="text-sm">{job.companyProfile.description}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="applicants">All Applicants</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applicants" className="mt-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Skills & Qualifications</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobApplicants.length > 0 ? (
                  jobApplicants.map((applicant) => (
                    <ApplicantRow
                      key={applicant.id}
                      applicant={applicant}
                      onViewApplicant={handleViewApplicant}
                      onViewCoverLetter={handleViewCoverLetter}
                      onEditApplicant={handleEditApplicant}
                      onDeleteApplicant={handleDeleteClick}
                      onChangeAction={handleChangeAction}
                      onMessageApplicant={handleMessageApplicant}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableHead colSpan={5} className="text-center py-8">
                      No applicants yet for this job
                    </TableHead>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="interviews" className="mt-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {interviewedApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {interviewedApplicants.map((applicant) => (
                  <Card key={applicant.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{applicant.name}</CardTitle>
                      <p className="text-sm text-gray-500">{applicant.email}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">Experience: {applicant.experience}</p>
                        <p className="text-sm font-medium">Education: {applicant.education}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-1 mb-3">
                          {applicant.skills.slice(0, 3).map((skill, index) => (
                            <Button key={index} variant="outline" size="sm" className="px-2 py-0 h-6 text-xs">
                              {skill}
                            </Button>
                          ))}
                          {applicant.skills.length > 3 && (
                            <Button variant="outline" size="sm" className="px-2 py-0 h-6 text-xs">
                              +{applicant.skills.length - 3}
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-brand-blue border-brand-blue hover:bg-brand-blue/10"
                            onClick={() => handleScheduleInterview(applicant)}
                          >
                            Schedule Interview
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMessageApplicant(applicant)}
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No candidates selected for interviews yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Shortlist or interview applicants to see them here
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CoverLetterDialog
        open={coverLetterDialogOpen}
        onOpenChange={setCoverLetterDialogOpen}
        applicant={selectedApplicant}
      />

      <DeleteApplicantDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        applicant={selectedApplicant}
        onConfirm={confirmDelete}
      />

      <ApplicantProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        applicant={selectedApplicant}
      />
      
      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Send Message to {selectedApplicant?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="my-4">
            <p className="text-sm text-gray-500 mb-2">
              This message will be sent to the applicant's email address.
            </p>
            <Textarea 
              placeholder="Write your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} className="bg-brand-blue hover:bg-brand-darkBlue">
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
