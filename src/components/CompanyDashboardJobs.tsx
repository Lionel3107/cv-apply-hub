
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Users, Download, Calendar, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useJobs } from "@/hooks/use-jobs";
import { useApplications } from "@/hooks/use-applications";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { useJobFilters } from "@/hooks/use-job-filters";
import { exportJobsData } from "@/utils/exportUtils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Event, useEvents } from "@/hooks/use-events";
import { Job } from "@/types/job";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CompanyDashboardJobs = ({ onSelectJob }) => {
  const { profile } = useAuth();
  const { jobs, isLoading: jobsLoading, error: jobsError } = useJobs(profile?.company_id);
  const { applications } = useApplications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: '',
    location: '',
    salary: '',
    description: '',
    is_featured: false,
    is_remote: false
  });
  const { filters, setFilter, resetFilters } = useJobFilters();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'interview',
    date: new Date(),
    isAllDay: false,
    status: 'pending'
  });
  const { events } = useEvents();

  useEffect(() => {
    if (!jobs) return;
    
    let filtered = [...jobs];
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(job => job.type === filters.type);
    }
    
    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(job => job.location.includes(filters.location));
    }
    
    // Apply remote filter
    if (filters.isRemote !== null) {
      filtered = filtered.filter(job => job.isRemote === filters.isRemote);
    }
    
    // Apply featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter(job => job.featured === filters.featured);
    }
    
    // Apply date posted filter
    if (filters.datePosted) {
      const now = new Date();
      
      // Convert string filter to actual date logic
      switch (filters.datePosted) {
        case 'today':
          const today = new Date(now.setHours(0, 0, 0, 0));
          filtered = filtered.filter(job => new Date(job.postedDate) >= today);
          break;
        case 'this_week':
          const thisWeek = new Date(now.setDate(now.getDate() - 7));
          filtered = filtered.filter(job => new Date(job.postedDate) >= thisWeek);
          break;
        case 'this_month':
          const thisMonth = new Date(now.setDate(now.getDate() - 30));
          filtered = filtered.filter(job => new Date(job.postedDate) >= thisMonth);
          break;
        default:
          break;
      }
    }
    
    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const handleEditClick = (job) => {
    setJobToEdit(job);
    setEditForm({
      title: job.title,
      type: job.type,
      location: job.location,
      salary: job.salary || '',
      description: job.description,
      is_featured: job.featured,
      is_remote: job.isRemote
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSwitchChange = (checked, name) => {
    setEditForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!jobToEdit) return;

    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          title: editForm.title,
          type: editForm.type,
          location: editForm.location,
          salary: editForm.salary || null,
          description: editForm.description,
          is_featured: editForm.is_featured,
          is_remote: editForm.is_remote
        })
        .eq("id", jobToEdit.id);

      if (error) throw error;
        
      toast.success(`Job "${editForm.title}" updated successfully`);
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    }
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      try {
        const { error } = await supabase
          .from("jobs")
          .delete()
          .eq("id", jobToDelete.id);

        if (error) throw error;
        
        toast.success(`Job "${jobToDelete.title}" deleted successfully`);
      } catch (error) {
        console.error("Error deleting job:", error);
        toast.error("Failed to delete job");
      } finally {
        setDeleteDialogOpen(false);
        setJobToDelete(null);
      }
    }
  };

  const getApplicantCount = (jobId) => {
    return applications.filter(app => app.jobTitle === jobs.find(j => j.id === jobId)?.title).length;
  };

  const handleExportJobs = () => {
    const jobsWithCounts = filteredJobs.map(job => ({
      ...job,
      applicationCount: getApplicantCount(job.id)
    }));
    
    exportJobsData(jobsWithCounts);
    toast.success("Jobs exported successfully");
  };

  const openScheduleDialog = (job) => {
    setSelectedJob(job);
    setEventForm({
      title: `Interview for ${job.title}`,
      description: '',
      type: 'interview',
      date: new Date(),
      isAllDay: false,
      status: 'pending'
    });
    setScheduleDialogOpen(true);
  };

  const handleEventFormChange = (field, value) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob || !profile?.id) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .insert({
          title: eventForm.title,
          description: eventForm.description,
          type: eventForm.type,
          date: eventForm.date.toISOString(),
          is_all_day: eventForm.isAllDay,
          status: eventForm.status,
          user_id: profile.id,
          related_job_id: selectedJob.id
        });

      if (error) throw error;
        
      toast.success(`Event "${eventForm.title}" created successfully`);
      setScheduleDialogOpen(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const handleSearchChange = (e) => {
    setFilter('searchTerm', e.target.value);
  };

  if (jobsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Skeleton className="h-9 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500 mb-2">Error loading jobs: {jobsError}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportJobs}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link to="/post-job">
            <Button className="bg-brand-blue hover:bg-brand-darkBlue">
              <PlusCircle className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search jobs by title, description, or location..."
          value={filters.searchTerm || ''}
          onChange={handleSearchChange}
          className="max-w-md"
        />
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-6">
            {jobs.length === 0 
              ? "Start posting jobs to attract qualified candidates" 
              : "Try adjusting your search filters to see more results"}
          </p>
          {jobs.length === 0 && (
            <Link to="/post-job">
              <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                <PlusCircle className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            </Link>
          )}
          {jobs.length > 0 && (
            <Button variant="outline" onClick={resetFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="animate-fade-in hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        className="w-10 h-10 object-contain rounded mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                        {job.company.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-sm text-gray-600">
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      job.featured 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    }
                  >
                    {job.featured ? "Featured" : "Active"}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">
                      {getApplicantCount(job.id)} Applicants
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-100 text-xs">
                        +{job.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex flex-wrap gap-2 bg-gray-50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectJob(job)}
                  className="text-brand-blue border-brand-blue hover:bg-brand-blue/10"
                >
                  <Users className="h-4 w-4 mr-1" />
                  View Applicants
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditClick(job)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openScheduleDialog(job)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => handleDeleteClick(job)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job listing "{jobToDelete?.title}" and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Job Listing</DialogTitle>
            <DialogDescription>
              Make changes to your job listing. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Input
                    id="type"
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="salary">Salary (optional)</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={editForm.salary}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="h-24"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_remote"
                  checked={editForm.is_remote}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'is_remote')}
                />
                <Label htmlFor="is_remote">Remote Job</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={editForm.is_featured}
                  onCheckedChange={(checked) => handleSwitchChange(checked, 'is_featured')}
                />
                <Label htmlFor="is_featured">Feature this job (appears at the top)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Jobs</DialogTitle>
            <DialogDescription>
              Select criteria to filter your job listings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilter('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Job Type</Label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilter('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="datePosted">Date Posted</Label>
              <Select 
                value={filters.datePosted} 
                onValueChange={(value) => setFilter('datePosted', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This week</SelectItem>
                  <SelectItem value="this_month">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => setFilter('location', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="featured">Job Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={filters.featured === true}
                  onCheckedChange={(checked) => setFilter('featured', checked ? true : undefined)}
                />
                <Label htmlFor="featured">Featured jobs only</Label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="remote">Remote Work</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remote"
                  checked={filters.isRemote === true}
                  onCheckedChange={(checked) => setFilter('isRemote', checked ? true : undefined)}
                />
                <Label htmlFor="remote">Remote jobs only</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
            <Button onClick={() => setFilterDialogOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Schedule an Event</DialogTitle>
            <DialogDescription>
              Create a new event related to {selectedJob?.title}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={eventForm.title}
                  onChange={(e) => handleEventFormChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Select 
                  value={eventForm.type} 
                  onValueChange={(value) => handleEventFormChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="deadline">Application Deadline</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventForm.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventForm.date ? format(eventForm.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={eventForm.date}
                      onSelect={(date) => handleEventFormChange('date', date || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="event-description">Description (optional)</Label>
                <Textarea
                  id="event-description"
                  value={eventForm.description}
                  onChange={(e) => handleEventFormChange('description', e.target.value)}
                  className="h-20"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-all-day"
                  checked={eventForm.isAllDay}
                  onCheckedChange={(checked) => handleEventFormChange('isAllDay', checked)}
                />
                <Label htmlFor="is-all-day">All-day event</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
