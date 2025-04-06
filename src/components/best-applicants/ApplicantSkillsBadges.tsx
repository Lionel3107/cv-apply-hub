
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ApplicantSkillsBadgesProps {
  skills: string[];
}

export const ApplicantSkillsBadges: React.FC<ApplicantSkillsBadgesProps> = ({ skills }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.slice(0, 3).map((skill, i) => (
        <Badge key={i} variant="secondary" className="bg-blue-50">
          {skill}
        </Badge>
      ))}
      {skills.length > 3 && (
        <Badge variant="outline" className="bg-gray-50">
          +{skills.length - 3}
        </Badge>
      )}
    </div>
  );
};
