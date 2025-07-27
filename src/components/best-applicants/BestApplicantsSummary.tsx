import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Star, 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import { ApplicantWithScore } from "@/types/applicant";

interface BestApplicantsSummaryProps {
  applicantsByJob: {
    jobId: string;
    jobTitle: string;
    applicants: ApplicantWithScore[];
  }[];
}

export const BestApplicantsSummary: React.FC<BestApplicantsSummaryProps> = ({ 
  applicantsByJob 
}) => {
  // Calculer les statistiques globales
  const allApplicants = applicantsByJob.flatMap(job => job.applicants);
  const totalApplicants = allApplicants.length;
  const analyzedApplicants = allApplicants.filter(app => app.strengths && app.strengths.length > 0).length;
  const averageScore = totalApplicants > 0 
    ? Math.round(allApplicants.reduce((sum, app) => sum + app.score, 0) / totalApplicants)
    : 0;
  const topScorers = allApplicants.filter(app => app.score >= 80).length;
  const needsImprovement = allApplicants.filter(app => app.improvements && app.improvements.length >= 3).length;

  // Top 3 candidats globaux
  const top3Global = allApplicants
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Compétences les plus communes
  const allSkills = allApplicants.flatMap(app => app.skills || []);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topSkills = Object.entries(skillCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([skill]) => skill);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Statistiques générales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Candidats</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplicants}</div>
          <p className="text-xs text-muted-foreground">
            {applicantsByJob.length} poste{applicantsByJob.length > 1 ? 's' : ''} ouvert{applicantsByJob.length > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageScore}%</div>
          <p className="text-xs text-muted-foreground">
            {analyzedApplicants}/{totalApplicants} analysé{analyzedApplicants > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Excellents Scores</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topScorers}</div>
          <p className="text-xs text-muted-foreground">
            Score ≥ 80%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">À Améliorer</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{needsImprovement}</div>
          <p className="text-xs text-muted-foreground">
            ≥ 3 améliorations suggérées
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 