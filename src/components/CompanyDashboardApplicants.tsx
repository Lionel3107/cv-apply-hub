import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CoverLetterDialog } from "./applicants/CoverLetterDialog";
import { DeleteApplicantDialog } from "./applicants/DeleteApplicantDialog";
import { mockApplicants } from "@/data/mockApplicants";
import { Applicant } from "@/types/applicant";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Link } from "react-router-dom";

export const CompanyDashboardApplicants = () => {
  // Since we're removing this component from the dashboard tabs, let's keep basic functionality
  // for now in case it's still referenced elsewhere
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Applicants Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This section has been moved to individual job listings.</p>
          <p className="mb-4">Please visit the "My Job Listings" tab and click on "View Applicants" for a specific job.</p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
