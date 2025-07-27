
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trophy, Medal, Award, Brain, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ApplicantWithScore } from "@/types/applicant";
import { ApplicantScoreDisplay } from "./ApplicantScoreDisplay";
import { ApplicantSkillsBadges } from "./ApplicantSkillsBadges";
import { ApplicantImprovementsDisplay } from "./ApplicantImprovementsDisplay";
import { AnalysisStatusIndicator } from "./AnalysisStatusIndicator";
import { ApplicantActions } from "./ApplicantActions";

interface JobApplicantsCardProps {
  jobId: string;
  jobTitle: string;
  applicants: ApplicantWithScore[];
  isExpanded: boolean;
  onToggleExpand: (jobId: string) => void;
  onViewProfile: (applicant: ApplicantWithScore) => void;
  onViewCoverLetter: (applicant: ApplicantWithScore) => void;
  sortApplicants: (applicants: ApplicantWithScore[]) => ApplicantWithScore[];
  onAnalyzeApplicants: () => void;
  isAnalyzing: boolean;
}

export const JobApplicantsCard: React.FC<JobApplicantsCardProps> = ({
  jobId,
  jobTitle,
  applicants,
  isExpanded,
  onToggleExpand,
  onViewProfile,
  onViewCoverLetter,
  sortApplicants,
  onAnalyzeApplicants,
  isAnalyzing
}) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🥇 1er</Badge>;
      case 1:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">🥈 2ème</Badge>;
      case 2:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">🥉 3ème</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-600">#{index + 1}</Badge>;
    }
  };

  const sortedApplicants = sortApplicants(applicants);

  return (
    <Card key={jobId} className="mb-4">
      <CardHeader 
        className="flex flex-row items-center justify-between py-3 cursor-pointer hover:bg-gray-50 transition-colors" 
        onClick={() => onToggleExpand(jobId)}
      >
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg">{jobTitle}</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {applicants.length} candidat{applicants.length > 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAnalyzeApplicants();
            }}
            disabled={isAnalyzing}
            variant="outline"
            size="sm"
            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Brain className="mr-1 h-3 w-3" />
                Analyser
              </>
            )}
          </Button>
          <Button variant="ghost" size="icon">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16">Rang</TableHead>
                  <TableHead>Candidat</TableHead>
                  <TableHead className="w-32">Score IA</TableHead>
                  <TableHead className="w-24">Statut</TableHead>
                  <TableHead>Compétences Clés</TableHead>
                  <TableHead>Forces Identifiées</TableHead>
                  <TableHead>Améliorations</TableHead>
                  <TableHead>Expérience</TableHead>
                  <TableHead className="text-right w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplicants.map((applicant, index) => (
                  <TableRow key={applicant.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div className="mt-1">
                        {getRankBadge(index)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={applicant.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {applicant.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{applicant.name}</div>
                          <div className="text-sm text-gray-500">{applicant.email}</div>
                          <div className="text-xs text-gray-400">
                            Postulé le {new Date(applicant.appliedDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ApplicantScoreDisplay score={applicant.score} />
                    </TableCell>
                    <TableCell>
                      <AnalysisStatusIndicator 
                        hasAnalysis={applicant.strengths && applicant.strengths.length > 0}
                        score={applicant.score}
                        lastUpdated={applicant.updatedAt}
                        hasAiConsent={applicant.aiConsent}
                      />
                    </TableCell>
                    <TableCell>
                      <ApplicantSkillsBadges skills={applicant.skills} />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {applicant.strengths && applicant.strengths.length > 0 ? (
                          applicant.strengths.slice(0, 2).map((strength, idx) => (
                            <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              ✓ {strength}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">Non analysé</span>
                        )}
                        {applicant.strengths && applicant.strengths.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{applicant.strengths.length - 2} autre{applicant.strengths.length - 2 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ApplicantImprovementsDisplay improvements={applicant.improvements || []} />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {applicant.experience ? (
                          <div className="text-sm text-gray-700">
                            {applicant.experience.length > 80
                              ? `${applicant.experience.substring(0, 80)}...`
                              : applicant.experience}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Non spécifiée</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ApplicantActions
                        applicant={applicant}
                        onViewProfile={onViewProfile}
                        onViewCoverLetter={onViewCoverLetter}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Résumé des statistiques */}
          {sortedApplicants.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Statistiques du classement</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Score moyen</div>
                  <div className="font-semibold text-gray-900">
                    {Math.round(sortedApplicants.reduce((sum, app) => sum + app.score, 0) / sortedApplicants.length)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Meilleur score</div>
                  <div className="font-semibold text-green-600">
                    {Math.max(...sortedApplicants.map(app => app.score))}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Candidats analysés</div>
                  <div className="font-semibold text-gray-900">
                    {sortedApplicants.filter(app => app.strengths && app.strengths.length > 0).length}/{sortedApplicants.length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Top 3</div>
                  <div className="font-semibold text-blue-600">
                    {sortedApplicants.slice(0, 3).map(app => app.name.split(' ')[0]).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
