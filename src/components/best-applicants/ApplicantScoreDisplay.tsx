
import React from "react";
import { Star } from "lucide-react";

interface ApplicantScoreDisplayProps {
  score: number;
}

export const ApplicantScoreDisplay: React.FC<ApplicantScoreDisplayProps> = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };
  
  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = score % 20 >= 10;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 font-medium">{score}%</span>
      </div>
    );
  };

  return (
    <div className={`font-bold ${getScoreColor(score)}`}>
      {renderStars(score)}
    </div>
  );
};
