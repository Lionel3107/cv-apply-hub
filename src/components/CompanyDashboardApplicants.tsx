
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, MessageSquare, UserCheck, UserX } from "lucide-react";

// Mock applicants data for demonstration
const mockApplicants = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2023-10-15",
    resumeUrl: "#",
    status: "new"
  },
  {
    id: "2",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    jobTitle: "UX Designer",
    appliedDate: "2023-10-14",
    resumeUrl: "#",
    status: "interviewed"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    jobTitle: "Product Manager",
    appliedDate: "2023-10-13",
    resumeUrl: "#",
    status: "rejected"
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    jobTitle: "Backend Developer",
    appliedDate: "2023-10-12",
    resumeUrl: "#",
    status: "new"
  },
  {
    id: "5",
    name: "David Lee",
    email: "david.lee@example.com",
    jobTitle: "Marketing Specialist",
    appliedDate: "2023-10-11",
    resumeUrl: "#",
    status: "shortlisted"
  }
];

export const CompanyDashboardApplicants = () => {
  const [applicants] = useState(mockApplicants);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
      case "shortlisted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Shortlisted</Badge>;
      case "interviewed":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Interviewed</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Applicants</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{applicant.name}</div>
                    <div className="text-sm text-gray-500">{applicant.email}</div>
                  </div>
                </TableCell>
                <TableCell>{applicant.jobTitle}</TableCell>
                <TableCell>
                  {new Date(applicant.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {getStatusBadge(applicant.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600">
                      <UserCheck className="h-4 w-4 mr-1" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                      <UserX className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
