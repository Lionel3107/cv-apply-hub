
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ApplicantApplication } from "@/types/applicant";
import { CalendarDays } from "lucide-react";

interface ApplicationDetailsDialogProps {
  application: ApplicantApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApplicationDetailsDialog = ({
  application,
  open,
  onOpenChange,
}: ApplicationDetailsDialogProps) => {
  if (!application) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "shortlisted":
        return <Badge className="bg-purple-500">Shortlisted</Badge>;
      case "interviewed":
        return <Badge className="bg-orange-500">Interviewed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "hired":
        return <Badge className="bg-green-500">Hired</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{application.jobTitle}</DialogTitle>
          <DialogDescription>
            Application for {application.companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <CalendarDays className="w-4 h-4 mr-1" />
              <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
            </div>
            {getStatusBadge(application.status)}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Application Status History:</p>
            <ul className="space-y-2 text-sm">
              {application.statusUpdates.map((update, index) => (
                <li key={index} className="flex justify-between">
                  <span>{update.status}</span>
                  <span className="text-gray-500">
                    {new Date(update.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {application.feedback && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Feedback:</p>
              <p className="text-sm bg-gray-50 p-3 rounded-md">
                {application.feedback}
              </p>
            </div>
          )}

          {application.nextSteps && (
            <div className="space-y-2 border-t pt-3">
              <p className="text-sm font-medium">Next Steps:</p>
              <p className="text-sm">{application.nextSteps}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
