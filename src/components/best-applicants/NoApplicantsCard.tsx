
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const NoApplicantsCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No applications received yet</h3>
        <p className="text-gray-500 mb-4">When candidates apply for your jobs, you'll see their matching scores here</p>
      </CardContent>
    </Card>
  );
};
