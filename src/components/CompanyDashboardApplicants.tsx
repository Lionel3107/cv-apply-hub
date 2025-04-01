
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
import { 
  Download, 
  Eye, 
  MessageSquare, 
  UserCheck, 
  UserX, 
  Star, 
  StarHalf, 
  Edit,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Enhanced mock applicants data with skills and ranking information
const mockApplicants = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2023-10-15",
    resumeUrl: "#",
    status: "new",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experience: "5 years",
    education: "BS Computer Science",
    ranking: 4.5
  },
  {
    id: "2",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    jobTitle: "UX Designer",
    appliedDate: "2023-10-14",
    resumeUrl: "#",
    status: "interviewed",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    experience: "3 years",
    education: "MA Design",
    ranking: 4.0
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    jobTitle: "Product Manager",
    appliedDate: "2023-10-13",
    resumeUrl: "#",
    status: "rejected",
    skills: ["Agile", "Scrum", "Product Strategy", "User Stories"],
    experience: "7 years",
    education: "MBA",
    ranking: 3.0
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    jobTitle: "Backend Developer",
    appliedDate: "2023-10-12",
    resumeUrl: "#",
    status: "new",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    experience: "4 years",
    education: "MS Computer Engineering",
    ranking: 4.8
  },
  {
    id: "5",
    name: "David Lee",
    email: "david.lee@example.com",
    jobTitle: "Marketing Specialist",
    appliedDate: "2023-10-11",
    resumeUrl: "#",
    status: "shortlisted",
    skills: ["SEO", "Content Marketing", "Social Media", "Analytics"],
    experience: "2 years",
    education: "BS Marketing",
    ranking: 3.5
  }
];

export const CompanyDashboardApplicants = () => {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<(typeof mockApplicants)[0] | null>(null);

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

  const getRankingStars = (ranking: number) => {
    const fullStars = Math.floor(ranking);
    const hasHalfStar = ranking % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm text-gray-600">{ranking.toFixed(1)}</span>
      </div>
    );
  };

  const handleDeleteClick = (applicant: (typeof mockApplicants)[0]) => {
    setSelectedApplicant(applicant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedApplicant) {
      setApplicants(applicants.filter(app => app.id !== selectedApplicant.id));
      toast.success(`Applicant ${selectedApplicant.name} removed successfully`);
      setDeleteDialogOpen(false);
      setSelectedApplicant(null);
    }
  };

  const handleEditApplicant = (applicant: (typeof mockApplicants)[0]) => {
    // In a real app, this would open an edit form
    toast.info(`Edit applicant: ${applicant.name}`);
  };

  const handleViewApplicant = (applicant: (typeof mockApplicants)[0]) => {
    // In a real app, this would navigate to a detailed view
    toast.info(`Viewing applicant: ${applicant.name}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Applicants Management</h2>
        <div>
          <Button size="sm" className="mr-2">
            Export List
          </Button>
          <Button size="sm">
            Filter Applicants
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Skills & Qualifications</TableHead>
              <TableHead>Ranking</TableHead>
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
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {applicant.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      Experience: {applicant.experience} | Education: {applicant.education}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getRankingStars(applicant.ranking)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(applicant.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleViewApplicant(applicant)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditApplicant(applicant)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteClick(applicant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedApplicant?.name}'s application?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
