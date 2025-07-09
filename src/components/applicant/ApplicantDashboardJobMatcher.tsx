import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, MapPin, Star, Eye, Send } from "lucide-react";
import { useCVJobMatching } from "@/hooks/use-cv-job-matching";
import { useNavigate } from "react-router-dom";

export const ApplicantDashboardJobMatcher = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const { matchCVToJobs, matchedJobs, isLoading } = useCVJobMatching();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) return;
    await matchCVToJobs(cvFile);
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApply = (jobId: string) => {
    navigate(`/jobs/${jobId}#apply`);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Job Matcher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cv-upload">Upload your CV</Label>
            <Input
              id="cv-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={!cvFile || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing CV...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Find Matching Jobs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {matchedJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Top Job Matches</h3>
          {matchedJobs.map((job) => (
            <Card key={job.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                      {job.isRemote && <Badge variant="secondary">Remote</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getMatchScoreColor(job.matchScore)} text-white`}>
                      <Star className="h-3 w-3 mr-1" />
                      {job.matchScore}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Why this job matches:</h4>
                  <p className="text-sm text-muted-foreground">{job.matchReason}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{job.type}</Badge>
                  <Badge variant="outline">{job.category}</Badge>
                  {job.salary && <Badge variant="outline">{job.salary}</Badge>}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewJob(job.id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleApply(job.id)}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};