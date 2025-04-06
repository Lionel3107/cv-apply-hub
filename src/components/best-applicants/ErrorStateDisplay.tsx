
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateDisplayProps {
  error: string;
}

export const ErrorStateDisplay: React.FC<ErrorStateDisplayProps> = ({ error }) => {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Best Applicants by Job</h2>
      </div>
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error loading applicants</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    </div>
  );
};
