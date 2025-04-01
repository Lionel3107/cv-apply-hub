
import { Applicant } from "@/types/applicant";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CoverLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
}

export const CoverLetterDialog = ({ open, onOpenChange, applicant }: CoverLetterDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cover Letter - {applicant?.name}</DialogTitle>
          <DialogDescription>
            Application for: {applicant?.jobTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
          <p className="whitespace-pre-line text-gray-700">
            {applicant?.coverLetter || "No cover letter provided."}
          </p>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
