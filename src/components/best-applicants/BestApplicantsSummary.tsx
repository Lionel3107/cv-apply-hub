import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Target,
  Star,
  CheckCircle,
  AlertCircle,
  Brain
} from 'lucide-react';

interface BestApplicantsSummaryProps {
  applicantsByJob: {
    jobId: string;
    jobTitle: string;
    jobDescription: string;
    applicants: any[];
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
  const excellentCandidates = allApplicants.filter(app => app.score >= 90).length;

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

  if (totalApplicants === 0) {
    return (
              <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-500">Start by posting job offers to see candidates</p>
          </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplicants}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-gray-500">
                                 <CheckCircle className="h-3 w-3 mr-1" />
                 {analyzedApplicants} analyzed
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={averageScore} className="h-2" />
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm font-medium text-gray-600">Excellent</p>
                <p className="text-2xl font-bold text-green-600">{excellentCandidates}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Star className="h-3 w-3 mr-1" />
                Score ≥ 90%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                                 <p className="text-sm font-medium text-gray-600">Needs Improvement</p>
                <p className="text-2xl font-bold text-orange-600">{needsImprovement}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-gray-500">
                                 <Brain className="h-3 w-3 mr-1" />
                 Needs help
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 et Compétences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 3 Candidats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                             <Trophy className="h-5 w-5 text-yellow-600" />
               Top 3 Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {top3Global.map((applicant, index) => (
                <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
                      <span className="text-sm font-bold text-gray-700">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{applicant.name}</div>
                      <div className="text-xs text-gray-500">{applicant.jobTitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {applicant.score}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compétences Populaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                             <TrendingUp className="h-5 w-5 text-blue-600" />
               Popular Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSkills.length > 0 ? (
                topSkills.map((skill, index) => {
                  const count = skillCounts[skill];
                  const percentage = Math.round((count / totalApplicants) * 100);
                  
                  return (
                    <div key={skill} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-sm font-medium text-gray-700">{skill}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{percentage}%</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                                 <div className="text-center text-gray-500 py-4">
                   <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                   <p>No skills analyzed</p>
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 