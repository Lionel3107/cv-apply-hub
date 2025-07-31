import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Lightbulb } from "lucide-react";

interface ApplicantImprovementsDisplayProps {
  improvements: string[];
  maxDisplay?: number;
}

export const ApplicantImprovementsDisplay: React.FC<ApplicantImprovementsDisplayProps> = ({ 
  improvements, 
  maxDisplay = 2 
}) => {
  if (!improvements || improvements.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic">
        No improvements suggested
      </div>
    );
  }

  const displayedImprovements = improvements.slice(0, maxDisplay);
  const remainingImprovements = improvements.slice(maxDisplay);

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {displayedImprovements.map((improvement, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className="bg-orange-50 text-orange-700 border-orange-200 text-xs font-medium"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              {improvement}
            </Badge>
          ))}
          {remainingImprovements.length > 0 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="bg-gray-50 text-gray-600 text-xs cursor-help">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  +{remainingImprovements.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-medium">Other suggested improvements:</div>
                  <div className="space-y-1">
                    {remainingImprovements.map((improvement, idx) => (
                      <div key={idx} className="text-xs text-gray-600">
                        • {improvement}
                      </div>
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
            {improvements.length} suggestion{improvements.length > 1 ? 's' : ''} d'amélioration
          </span>
          {improvements.length >= 3 && (
            <span className="text-orange-600 font-medium">
              ⚠️ Améliorations importantes
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}; 