
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search, Filter, Download, Calendar } from "lucide-react";
import { Job } from "@/types/job";
import { useApplications } from "@/hooks/use-applications";
import { Applicant, ApplicationStatus } from "@/types/applicant";
import { ApplicantRow } from "./applicants/ApplicantRow";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicantProfileDialog } from "./applicants/ApplicantProfileDialog";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { DeleteApplicantDialog } from "./applicants/DeleteApplicantDialog";
import { MessageDialog } from "./applicants/MessageDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { exportApplicantsData } from "@/utils/exportUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface JobApplicantsViewProps {
  job: Job;
  onBack: () => void;
}

export const JobApplicantsView = ({ job, onBack }: JobApplicantsViewProps) => {
  const { applications, isLoading, error } = useApplications(job.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Added new state for filters
  const [filters, setFilters] = useState<{
    status: ApplicationStatus | '';
    startDate: Date | null;
    endDate: Date | null;
    skillsFilter: string;
  }>({
    status: '',
    startDate: null,
    endDate: null,
    skillsFilter: ''
  });

  useEffect(() => {
    if (!applications) return;
    
    let filtered = [...applications];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(term) ||
          applicant.email.toLowerCase().includes(term) ||
          applicant.experience.toLowerCase().includes(term) ||
          applicant.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(applicant => applicant.action === filters.status);
    }
    
    // Apply date range filters
    if (filters.startDate) {
      filtered = filtered.filter(applicant => 
        new Date(applicant.appliedDate) >= filters.startDate!
      );
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(applicant => 
        new Date(applicant.appliedDate) <= filters.endDate!
      );
    }
    
    // Apply skills filter
    if (filters.skillsFilter) {
      const skillsTerms = filters.skillsFilter.toLowerCase().split(',').map(s => s.trim());
      filtered = filtered.filter(applicant => 
        applicant.skills.some(skill => 
          skillsTerms.some(term => skill.toLowerCase().includes(term))
        )
      );
    }
    
    setFilteredApplicants(filtered);
  }, [applications, searchTerm, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled in the effect
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      startDate: null,
      endDate: null,
      skillsFilter: ''
    });
    setSearchTerm('');
  };

  const handleViewProfile = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsProfileOpen(true);
  };

  const handleViewCoverLetter = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsCoverLetterOpen(true);
  };

  const handleMessageApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsMessageDialogOpen(true);
  };

  const handleDeleteClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedApplicant) return;
    
    try {
      // Delete the application from the database
      const { error: deleteError } = await supabase
        .from("applications")
        .delete()
        .eq("id", selectedApplicant.id);
        
      if (deleteError) throw deleteError;
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      
      // Show success message
      toast.success(`Application from ${selectedApplicant.name} has been deleted`);
    } catch (err: any) {
      console.error("Error deleting application:", err);
      toast.error("Failed to delete application");
    }
  };

  const handleChangeAction = async (applicant: Applicant, newAction: Applicant["action"]) => {
    try {
      // Update the application status in the database
      const { error: updateError } = await supabase
        .from("applications")
        .update({ status: newAction })
        .eq("id", applicant.id);
        
      if (updateError) throw updateError;
      
      // Show success message
      toast.success(`Application status updated to ${newAction}`);
    } catch (err: any) {
      console.error("Error updating application status:", err);
      toast.error("Failed to update status");
    }
  };

  const handleExportApplicants = () => {
    exportApplicantsData(filteredApplicants, job.title);
    toast.success(`Applicants for "${job.title}" exported successfully`);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">{job.title} - Applicants</h2>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Loading applicants...</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">{job.title} - Applicants</h2>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading applicants: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{job.title} - Applicants</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle>All Applicants ({filteredApplicants.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportApplicants}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10"
                placeholder="Search by name, skills, or experience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          {/* Active filters display */}
          {(filters.status || filters.startDate || filters.endDate || filters.skillsFilter) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500">Active filters:</span>
              
              {filters.status && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  Status: {filters.status}
                </Badge>
              )}
              
              {filters.startDate && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  From: {format(filters.startDate, 'MMM dd, yyyy')}
                </Badge>
              )}
              
              {filters.endDate && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  To: {format(filters.endDate, 'MMM dd, yyyy')}
                </Badge>
              )}
              
              {filters.skillsFilter && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  Skills: {filters.skillsFilter}
                </Badge>
              )}
              
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-gray-500">
                Clear all
              </Button>
            </div>
          )}

          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <p className="text-gray-500 mb-2">No applicants found</p>
              <p className="text-sm text-gray-400">
                {applications.length > 0
                  ? "Try adjusting your search criteria"
                  : "There are no applications for this job yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.map((applicant) => (
                    <ApplicantRow
                      key={applicant.id}
                      applicant={applicant}
                      onViewApplicant={handleViewProfile}
                      onViewCoverLetter={handleViewCoverLetter}
                      onEditApplicant={() => {}}
                      onDeleteApplicant={handleDeleteClick}
                      onChangeAction={handleChangeAction}
                      onMessageApplicant={handleMessageApplicant}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Applicants</DialogTitle>
            <DialogDescription>
              Set criteria to filter applicants for {job.title}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Application Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value: ApplicationStatus | '') => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateRange">Applied Date (From)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(filters.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.startDate || undefined}
                    onSelect={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endDate">Applied Date (To)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(filters.endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.endDate || undefined}
                    onSelect={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                placeholder="e.g. React, TypeScript, CSS"
                value={filters.skillsFilter}
                onChange={(e) => setFilters(prev => ({ ...prev, skillsFilter: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedApplicant && (
        <>
          <ApplicantProfileDialog
            applicant={selectedApplicant}
            open={isProfileOpen}
            onOpenChange={setIsProfileOpen}
          />
          <CoverLetterDialog
            applicant={selectedApplicant}
            open={isCoverLetterOpen}
            onOpenChange={setIsCoverLetterOpen}
          />
          <DeleteApplicantDialog
            applicant={selectedApplicant}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
          />
          <MessageDialog
            applicant={selectedApplicant}
            open={isMessageDialogOpen}
            onOpenChange={setIsMessageDialogOpen}
          />
        </>
      )}
    </div>
  );
};
