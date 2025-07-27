
import React from "react";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApplicantScoreDisplayProps {
  score: number;
  showTrend?: boolean;
  previousScore?: number;
}

export const ApplicantScoreDisplay: React.FC<ApplicantScoreDisplayProps> = ({ 
  score, 
  showTrend = false, 
  previousScore 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 75) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Très bon";
    if (score >= 60) return "Bon";
    if (score >= 40) return "Moyen";
    return "Faible";
  };
  
  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = score % 20 >= 10;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return stars;
  };

  const getTrendIcon = () => {
    if (!previousScore || !showTrend) return null;
    
    const difference = score - previousScore;
    if (difference > 0) {
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    } else if (difference < 0) {
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      {/* Score principal */}
      <div className={`font-bold ${getScoreColor(score)}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {renderStars(score)}
            <span className="ml-1 text-lg">{score}%</span>
          </div>
          {getTrendIcon()}
        </div>
      </div>
      
      {/* Badge de niveau */}
      <Badge className={`text-xs font-medium ${getScoreBadge(score)}`}>
        {getScoreLevel(score)}
      </Badge>
      
      {/* Indicateur de tendance */}
      {showTrend && previousScore && (
        <div className="text-xs text-gray-500">
          {score > previousScore ? (
            <span className="text-green-600">+{score - previousScore}%</span>
          ) : score < previousScore ? (
            <span className="text-red-600">{score - previousScore}%</span>
          ) : (
            <span>Pas de changement</span>
          )}
        </div>
      )}
    </div>
  );
};
