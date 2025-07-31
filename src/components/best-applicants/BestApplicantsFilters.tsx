
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Users, Star, TrendingUp } from "lucide-react";

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
        <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="scoreDesc">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              AI Score (descending)
            </div>
          </SelectItem>
          <SelectItem value="scoreAsc">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              AI Score (ascending)
            </div>
          </SelectItem>
          <SelectItem value="experienceDesc">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Plus d'expérience
            </div>
          </SelectItem>
          <SelectItem value="experienceAsc">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Moins d'expérience
            </div>
          </SelectItem>
          <SelectItem value="skillsDesc">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              More skills
            </div>
          </SelectItem>
          <SelectItem value="nameAsc">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Nom (A-Z)
            </div>
          </SelectItem>
          <SelectItem value="dateDesc">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Plus récent
            </div>
          </SelectItem>
          <SelectItem value="dateAsc">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Plus ancien
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <Select defaultValue="all" onValueChange={onLimitChange}>
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Afficher</span>
          </div>
        </SelectTrigger>
        <SelectContent>
                          <SelectItem value="all">All candidates</SelectItem>
          <SelectItem value="3">Top 3</SelectItem>
          <SelectItem value="5">Top 5</SelectItem>
          <SelectItem value="10">Top 10</SelectItem>
          <SelectItem value="15">Top 15</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
