
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Applicant } from "@/types/applicant";

interface CoverLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
}

export const CoverLetterDialog = ({
  open,
  onOpenChange,
  applicant,
}: CoverLetterDialogProps) => {
  if (!applicant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cover Letter</DialogTitle>
          <DialogDescription>
            Cover letter from {applicant.name} for {applicant.jobTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-6 bg-gray-50 rounded-md whitespace-pre-line font-serif">
          {applicant.coverLetter ? (
            applicant.coverLetter
          ) : (
            <p className="text-gray-500 italic text-center py-10">
              No cover letter was provided for this application.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {applicant.coverLetter && (
            <Button className="ml-2" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Save as PDF
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
