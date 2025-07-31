
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApplicantSkillsBadgesProps {
  skills: string[];
  maxDisplay?: number;
}

export const ApplicantSkillsBadges: React.FC<ApplicantSkillsBadgesProps> = ({ 
  skills, 
  maxDisplay = 4 
}) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic">
        No skills specified
      </div>
    );
  }

  const displayedSkills = skills.slice(0, maxDisplay);
  const remainingSkills = skills.slice(maxDisplay);

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {displayedSkills.map((skill, i) => (
            <Badge 
              key={i} 
              variant="secondary" 
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium"
            >
              {skill}
            </Badge>
          ))}
          {remainingSkills.length > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="bg-gray-50 text-gray-600 text-xs cursor-help">
                  +{remainingSkills.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-medium">Other skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {remainingSkills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        {/* Indicateur de niveau */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {skills.length} skill{skills.length > 1 ? 's' : ''} identified
          </span>
          {skills.length >= 5 && (
            <span className="text-green-600 font-medium">
              ✓ Profil complet
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
