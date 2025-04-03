
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

interface JobApplicantsViewProps {
  job: Job;
  onBack: () => void;
}

export const JobApplicantsView = ({ job, onBack }: JobApplicantsViewProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [jobApplicants, setJobApplicants] = useState<Applicant[]>(
    mockApplicants.slice(0, Math.floor(Math.random() * 5) + 1)
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

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
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
    </div>
  );
};
