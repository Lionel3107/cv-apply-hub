
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Download, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApplicantsWithScore } from "@/data/mockApplicantsWithScore";
import { mockJobs } from "@/data/mockJobs";
import { toast } from "sonner";

// Associate applicants with jobs
const applicantsByJob = [
  {
    jobId: "1",
    jobTitle: "Frontend Developer",
    applicants: mockApplicantsWithScore.slice(0, 3)
  },
  {
    jobId: "2",
    jobTitle: "UX Designer",
    applicants: mockApplicantsWithScore.slice(3, 5)
  },
  {
    jobId: "3",
    jobTitle: "Backend Developer",
    applicants: mockApplicantsWithScore.slice(5)
  }
];

export const CompanyDashboardBestApplicants = () => {
  const [expandedJob, setExpandedJob] = useState<string | null>("1");
  const [sortBy, setSortBy] = useState("scoreDesc");
  const [limitCount, setLimitCount] = useState<number | null>(null);
  
  const handleToggleJob = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };
  
  const sortApplicants = (applicants) => {
    const sorted = [...applicants].sort((a, b) => {
      switch (sortBy) {
        case "scoreDesc":
          return b.score - a.score;
        case "scoreAsc":
          return a.score - b.score;
        case "experienceDesc":
          return parseInt(b.experience) - parseInt(a.experience);
        case "nameAsc":
          return a.name.localeCompare(b.name);
        default:
          return b.score - a.score;
      }
    });
    
    if (limitCount) {
      return sorted.slice(0, limitCount);
    }
    
    return sorted;
  };
  
  const handleSort = (value) => {
    setSortBy(value);
  };

  const handleLimit = (value) => {
    setLimitCount(value === "all" ? null : parseInt(value));
  };
  
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };
  
  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = score % 20 >= 10;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 font-medium">{score}%</span>
      </div>
    );
  };
  
  const handleViewProfile = (applicant) => {
    toast.info(`Viewing profile for ${applicant.name}`);
  };
  
  const handleDownloadCV = (applicant) => {
    toast.success(`Resume for ${applicant.name} downloaded`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-bold">Best Applicants by Job</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scoreDesc">Highest Score</SelectItem>
              <SelectItem value="scoreAsc">Lowest Score</SelectItem>
              <SelectItem value="experienceDesc">Most Experience</SelectItem>
              <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all" onValueChange={handleLimit}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Show top</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applicants</SelectItem>
              <SelectItem value="5">Top 5</SelectItem>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="15">Top 15</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {applicantsByJob.map((job) => (
        <Card key={job.jobId} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between py-3 cursor-pointer" onClick={() => handleToggleJob(job.jobId)}>
            <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
            <Button variant="ghost" size="icon">
              {expandedJob === job.jobId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CardHeader>
          
          {expandedJob === job.jobId && (
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Match Score</TableHead>
                      <TableHead>Key Skills</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortApplicants(job.applicants).map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={applicant.avatar} />
                              <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{applicant.name}</div>
                              <div className="text-sm text-gray-500">{applicant.jobTitle}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-bold ${getScoreColor(applicant.score)}`}>
                            {renderStars(applicant.score)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {applicant.skills.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="bg-blue-50">
                                {skill}
                              </Badge>
                            ))}
                            {applicant.skills.length > 3 && (
                              <Badge variant="outline" className="bg-gray-50">
                                +{applicant.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{applicant.experience}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewProfile(applicant)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Profile
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadCV(applicant)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              CV
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};
