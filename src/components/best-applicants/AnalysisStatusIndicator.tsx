import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Brain, Shield } from "lucide-react";

interface AnalysisStatusIndicatorProps {
  hasAnalysis: boolean;
  score: number;
  lastUpdated?: string;
  hasAiConsent?: boolean;
}

export const AnalysisStatusIndicator: React.FC<AnalysisStatusIndicatorProps> = ({
  hasAnalysis,
  score,
  lastUpdated,
  hasAiConsent = true // Default to true for backward compatibility
}) => {
  if (!hasAiConsent) {
    return (
      <div className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3 text-red-400" />
        <Badge variant="outline" className="text-xs text-red-500 bg-red-50 border-red-200">
          No AI Consent
        </Badge>
      </div>
    );
  }

  if (!hasAnalysis) {
    return (
      <div className="flex items-center gap-1">
        <Clock className="h-3 w-3 text-gray-400" />
        <Badge variant="outline" className="text-xs text-gray-500 bg-gray-50">
          Pending Analysis
        </Badge>
      </div>
    );
  }

  const getStatusColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-3 w-3" />;
    if (score >= 60) return <Brain className="h-3 w-3" />;
    return <AlertCircle className="h-3 w-3" />;
  };

  return (
    <div className="flex items-center gap-1">
      {getStatusIcon(score)}
      <Badge variant="outline" className={`text-xs ${getStatusColor(score)}`}>
        Analyzed
      </Badge>
      {lastUpdated && (
        <span className="text-xs text-gray-400">
          {new Date(lastUpdated).toLocaleDateString('en-US')}
        </span>
      )}
    </div>
  );
}; 