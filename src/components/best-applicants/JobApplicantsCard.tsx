
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Loader2, 
  Trophy, 
  Medal, 
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { ApplicantWithScore } from '@/types/applicant';
import { ApplicantScoreDisplay } from './ApplicantScoreDisplay';
import { AnalysisStatusIndicator } from './AnalysisStatusIndicator';
import { ApplicantActions } from '../applicants/ApplicantActions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 1:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 2:
      return <Award className="h-5 w-5 text-orange-500" />;
    default:
      return <Star className="h-4 w-4 text-gray-300" />;
  }
};

const getRankBadge = (index: number) => {
  const rank = index + 1;
  let color = "bg-gray-100 text-gray-600";
  
  if (rank === 1) color = "bg-yellow-100 text-yellow-700";
  else if (rank === 2) color = "bg-gray-100 text-gray-600";
  else if (rank === 3) color = "bg-orange-100 text-orange-700";
  
  return (
    <Badge variant="outline" className={`text-xs ${color}`}>
      #{rank}
    </Badge>
  );
};

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
            {applicants.length} candidate{applicants.length > 1 ? 's' : ''}
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
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-1 h-3 w-3" />
                Analyze
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedApplicants.map((applicant, index) => (
              <Card key={applicant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Header avec rang et score */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index)}
                      <div>
                        <div className="font-medium text-gray-900">{applicant.name}</div>
                        <div className="text-xs text-gray-500">{applicant.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <ApplicantScoreDisplay score={applicant.score} />
                      <div className="text-xs text-gray-500 mt-1">
                        Applied on {new Date(applicant.appliedDate).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>

                  {/* Statut d'analyse */}
                  <div className="mb-3">
                    <AnalysisStatusIndicator 
                      hasAnalysis={applicant.strengths && applicant.strengths.length > 0}
                      score={applicant.score}
                      lastUpdated={applicant.updatedAt}
                    />
                  </div>

                  {/* Compétences */}
                  <div className="mb-3">
                                         <div className="flex items-center gap-1 mb-2">
                       <Briefcase className="h-3 w-3 text-blue-600" />
                       <span className="text-xs font-medium text-gray-700">Skills</span>
                     </div>
                    <div className="flex flex-wrap gap-1">
                      {applicant.skills && applicant.skills.length > 0 ? (
                        applicant.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                            {skill}
                          </Badge>
                        ))
                                             ) : (
                         <span className="text-xs text-gray-400 italic">Not specified</span>
                       )}
                      {applicant.skills && applicant.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{applicant.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Forces */}
                  <div className="mb-3">
                                         <div className="flex items-center gap-1 mb-2">
                       <CheckCircle className="h-3 w-3 text-green-600" />
                       <span className="text-xs font-medium text-gray-700">Strengths</span>
                     </div>
                    <div className="space-y-1">
                      {applicant.strengths && applicant.strengths.length > 0 ? (
                        applicant.strengths.slice(0, 2).map((strength, idx) => (
                          <div key={idx} className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                            ✓ {strength}
                          </div>
                        ))
                                             ) : (
                         <span className="text-xs text-gray-400 italic">Not analyzed</span>
                       )}
                      {applicant.strengths && applicant.strengths.length > 2 && (
                                                 <div className="text-xs text-gray-500">
                           +{applicant.strengths.length - 2} more
                         </div>
                      )}
                    </div>
                  </div>

                  {/* Améliorations */}
                  <div className="mb-3">
                                         <div className="flex items-center gap-1 mb-2">
                       <Lightbulb className="h-3 w-3 text-orange-600" />
                       <span className="text-xs font-medium text-gray-700">Improvements</span>
                     </div>
                    <div className="space-y-1">
                      {applicant.improvements && applicant.improvements.length > 0 ? (
                        applicant.improvements.slice(0, 2).map((improvement, idx) => (
                          <div key={idx} className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
                            💡 {improvement}
                          </div>
                        ))
                                             ) : (
                         <span className="text-xs text-gray-400 italic">None suggested</span>
                       )}
                      {applicant.improvements && applicant.improvements.length > 2 && (
                                                 <div className="text-xs text-gray-500">
                           +{applicant.improvements.length - 2} more
                         </div>
                      )}
                    </div>
                  </div>

                  {/* Expérience */}
                  <div className="mb-4">
                                         <div className="flex items-center gap-1 mb-2">
                       <GraduationCap className="h-3 w-3 text-purple-600" />
                       <span className="text-xs font-medium text-gray-700">Experience</span>
                     </div>
                    <div className="text-xs text-gray-700">
                      {applicant.experience ? (
                        applicant.experience.length > 60
                          ? `${applicant.experience.substring(0, 60)}...`
                          : applicant.experience
                                             ) : (
                         <span className="text-gray-400 italic">Not specified</span>
                       )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <ApplicantActions
                      applicant={applicant}
                      jobDescription=""
                      onViewApplicant={onViewProfile}
                      onViewCoverLetter={onViewCoverLetter}
                      onEditApplicant={() => {}}
                      onDeleteApplicant={() => {}}
                      onChangeAction={() => {}}
                      onMessageApplicant={() => {}}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
