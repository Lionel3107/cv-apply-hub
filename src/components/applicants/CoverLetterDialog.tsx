
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { downloadFile } from "@/utils/exportUtils";

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

  const handleDownloadCoverLetter = () => {
    if (!applicant.coverLetter) return;
    
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0];
    const filename = `cover-letter-${applicant.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.txt`;
    
    downloadFile(applicant.coverLetter, filename, "text/plain");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cover Letter</DialogTitle>
          <DialogDescription>
            Cover letter from {applicant.name} for {applicant.jobTitle}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[50vh] w-full pr-4">
          <div className="p-6 bg-gray-50 rounded-md whitespace-pre-line font-serif">
            {applicant.coverLetter ? (
              applicant.coverLetter
            ) : (
              <p className="text-gray-500 italic text-center py-10">
                No cover letter was provided for this application.
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {applicant.coverLetter && (
            <>
              <Button className="ml-2" onClick={() => window.print()}>
                Print
              </Button>
              <Button className="ml-2" onClick={handleDownloadCoverLetter}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
