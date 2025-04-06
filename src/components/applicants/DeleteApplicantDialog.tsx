
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Applicant } from "@/types/applicant";

interface DeleteApplicantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
  onConfirmDelete: (applicantId: string) => Promise<void>;
}

export const DeleteApplicantDialog = ({
  open,
  onOpenChange,
  applicant,
  onConfirmDelete,
}: DeleteApplicantDialogProps) => {
  if (!applicant) return null;

  const handleConfirm = async () => {
    await onConfirmDelete(applicant.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the application from {applicant.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
