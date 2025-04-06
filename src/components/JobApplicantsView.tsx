
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
import { ChevronLeft, Search, Filter, Download, CalendarIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface JobApplicantsViewProps {
  job: Job;
  onBack: () => void;
}

export const JobApplicantsView: React.FC<JobApplicantsViewProps> = ({ job, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const { 
    applications, 
    isLoading, 
    error
  } = useApplications(job.id);

  const filteredApplicants = React.useMemo(() => {
    let filtered = [...(applications || [])];

    if (searchTerm) {
      filtered = filtered.filter(applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(applicant => applicant.action === statusFilter);
    }

    if (date) {
      filtered = filtered.filter(applicant => {
        const applicationDate = new Date(applicant.appliedDate);
        return (
          applicationDate.getFullYear() === date.getFullYear() &&
          applicationDate.getMonth() === date.getMonth() &&
          applicationDate.getDate() === date.getDate()
        );
      });
    }

    return filtered;
  }, [applications, searchTerm, statusFilter, date]);

  const handleStatusChange = async (applicantId: string, newStatus: ApplicationStatus) => {
    try {
      // Update the application status in the database
      const { error: updateError } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicantId);
        
      if (updateError) throw updateError;
      
      // Show success message
      toast.success(`Application status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteApplicant = async (applicantId: string) => {
    try {
      // Delete the application from the database
      const { error: deleteError } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicantId);
        
      if (deleteError) throw deleteError;
      
      // Show success message
      toast.success("Applicant deleted successfully");
    } catch (err: any) {
      toast.error(`Failed to delete applicant: ${err.message}`);
    }
  };

  const handleExport = () => {
    if (applications) {
      exportApplicantsData(applications, job.title);
    } else {
      toast.error("No data to export.");
    }
  };

  const toggleApplicantSelection = (applicantId: string) => {
    setSelectedApplicants(prev => {
      if (prev.includes(applicantId)) {
        return prev.filter(id => id !== applicantId);
      } else {
        return [...prev, applicantId];
      }
    });
  };

  useEffect(() => {
    if (selectAll) {
      setSelectedApplicants(filteredApplicants.map(applicant => applicant.id));
    } else {
      setSelectedApplicants([]);
    }
  }, [selectAll, filteredApplicants]);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // Define valid application statuses
  const allStatuses: ApplicationStatus[] = ["new", "shortlisted", "interviewed", "rejected", "hired"];

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Job Details
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Applicants for {job.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search applicants..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {allStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Label htmlFor="date">Applied Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2023-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Button variant="secondary" size="sm" className="w-full" onClick={() => {
                      setStatusFilter("all");
                      setDate(undefined);
                      setIsFilterOpen(false);
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="secondary" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.map((applicant) => (
                    <ApplicantRow
                      key={applicant.id}
                      applicant={applicant}
                      isSelected={selectedApplicants.includes(applicant.id)}
                      onSelect={() => toggleApplicantSelection(applicant.id)}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteApplicant}
                    />
                  ))}
                  {filteredApplicants.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No applicants found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
