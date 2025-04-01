
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
    case "shortlisted":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Shortlisted</Badge>;
    case "interviewed":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Interviewed</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

export const getRankingStars = (ranking: number) => {
  const fullStars = Math.floor(ranking);
  const hasHalfStar = ranking % 1 !== 0;
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
      <span className="ml-1 text-sm text-gray-600">{ranking.toFixed(1)}</span>
    </div>
  );
};
