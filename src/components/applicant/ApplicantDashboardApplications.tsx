
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, MessageCircle } from "lucide-react";
import { mockApplicantApplications } from "@/data/mockApplicantApplications";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ApplicationDetailsDialog } from "./ApplicationDetailsDialog";
import { ApplicationStatus, ApplicantApplication } from "@/types/applicant";

export const ApplicantDashboardApplications = () => {
  const [applications, setApplications] = useState(mockApplicantApplications);
  const [selectedApplication, setSelectedApplication] = useState<ApplicantApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "shortlisted":
        return <Badge className="bg-purple-500">Shortlisted</Badge>;
      case "interviewed":
        return <Badge className="bg-orange-500">Interviewed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "hired":
        return <Badge className="bg-green-500">Hired</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const handleViewDetails = (application: ApplicantApplication) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };

  const handleContactEmployer = (application: ApplicantApplication) => {
    toast.info(`Contact functionality will be implemented soon for ${application.companyName}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Job Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="font-medium">{application.jobTitle}</div>
                      </TableCell>
                      <TableCell>{application.companyName}</TableCell>
                      <TableCell>
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactEmployer(application)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">No applications yet</h3>
              <p className="text-gray-500 mb-4">
                Start applying to jobs to see your applications here
              </p>
              <Link to="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <ApplicationDetailsDialog 
        application={selectedApplication} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
      />
    </>
  );
};
