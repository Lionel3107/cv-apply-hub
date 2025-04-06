
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const LoadingStateDisplay: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-bold">Best Applicants by Job</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4 animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
