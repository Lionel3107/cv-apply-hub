
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { useJobs } from "@/hooks/use-jobs";
import { useApplications } from "@/hooks/use-applications";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const CompanyDashboardJobs = ({ onSelectJob }) => {
  const { profile } = useAuth();
  const { jobs, isLoading: jobsLoading, error: jobsError } = useJobs(profile?.company_id);
  const { applications } = useApplications();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleEditJob = (job) => {
    toast.info(`Editing job: ${job.title}`);
    // In a real app, this would navigate to an edit form
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
        <Link to="/post-job">
          <Button className="bg-brand-blue hover:bg-brand-darkBlue">
            <PlusCircle className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 mb-6">Start posting jobs to attract qualified candidates</p>
          <Link to="/post-job">
            <Button className="bg-brand-blue hover:bg-brand-darkBlue">
              <PlusCircle className="h-4 w-4 mr-2" />
              Post Your First Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
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
              
              <CardFooter className="border-t pt-4 flex justify-between bg-gray-50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectJob(job)}
                  className="text-brand-blue border-brand-blue hover:bg-brand-blue/10"
                >
                  <Users className="h-4 w-4 mr-1" />
                  View Applicants
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditJob(job)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
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
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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
    </div>
  );
};
