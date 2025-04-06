
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface BestApplicantsFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  onLimitChange: (value: string) => void;
}

export const BestApplicantsFilters: React.FC<BestApplicantsFiltersProps> = ({
  sortBy, 
  onSortChange, 
  onLimitChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="scoreDesc">Highest Score</SelectItem>
          <SelectItem value="scoreAsc">Lowest Score</SelectItem>
          <SelectItem value="experienceDesc">Most Experience</SelectItem>
          <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
        </SelectContent>
      </Select>
      
      <Select defaultValue="all" onValueChange={onLimitChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Show top</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Applicants</SelectItem>
          <SelectItem value="5">Top 5</SelectItem>
          <SelectItem value="10">Top 10</SelectItem>
          <SelectItem value="15">Top 15</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
