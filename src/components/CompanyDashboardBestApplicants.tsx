
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
import { Eye, Star, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApplicantsWithScore } from "@/data/mockApplicantsWithScore";
import { toast } from "sonner";

export const CompanyDashboardBestApplicants = () => {
  const [applicants, setApplicants] = useState(mockApplicantsWithScore);
  const [sortBy, setSortBy] = useState("scoreDesc");
  
  const sortedApplicants = [...applicants].sort((a, b) => {
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
  
  const handleSort = (value) => {
    setSortBy(value);
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Top Applicant Matches</CardTitle>
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
      </CardHeader>
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
              {sortedApplicants.map((applicant) => (
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
    </Card>
  );
};
