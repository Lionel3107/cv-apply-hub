
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";
import { mockJobs } from "@/data/mockJobs";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const CompanyDashboardJobs = ({ onSelectJob }) => {
  // In a real app, we would filter jobs by the logged-in company
  // For demo purposes, we'll use the first 5 jobs from mockJobs
  const companyJobs = mockJobs.slice(0, 5);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyJobs.map((job) => (
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
                    {/* Random number for demo purposes */}
                    {Math.floor(Math.random() * 50)} Applicants
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
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
