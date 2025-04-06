
import { useState, useEffect } from "react";
import { Applicant, ApplicationStatus } from "@/types/applicant";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useApplicantManagement = (applicants: Applicant[] | undefined) => {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Dialog states
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  // Reset selection when applicants change
  useEffect(() => {
    setSelectedApplicants([]);
    setSelectAll(false);
  }, [applicants]);

  // Update selected applicants when selectAll changes
  useEffect(() => {
    if (filteredApplicants.length === 0) return;
    
    if (selectAll) {
      setSelectedApplicants(filteredApplicants.map(applicant => applicant.id));
    } else {
      setSelectedApplicants([]);
    }
  }, [selectAll]);

  // Filter applicants based on search term, status, and date
  const filteredApplicants = applicants ? applicants.filter(applicant => {
    let matches = true;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      matches = matches && (
        applicant.name.toLowerCase().includes(term) ||
        applicant.email.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      matches = matches && applicant.action === statusFilter;
    }

    if (date) {
      const applicationDate = new Date(applicant.appliedDate);
      matches = matches && (
        applicationDate.getFullYear() === date.getFullYear() &&
        applicationDate.getMonth() === date.getMonth() &&
        applicationDate.getDate() === date.getDate()
      );
    }

    return matches;
  }) : [];

  const handleStatusChange = async (applicantId: string, newStatus: ApplicationStatus) => {
    try {
      // Update the application status in the database
      const { error: updateError } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicantId);
        
      if (updateError) throw updateError;
      
      // Show success message
      toast.success(`Application status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteApplicant = async (applicantId: string) => {
    try {
      // Delete the application from the database
      const { error: deleteError } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicantId);
        
      if (deleteError) throw deleteError;
      
      // Show success message
      toast.success("Applicant deleted successfully");
      
      // Close the dialog if open
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(`Failed to delete applicant: ${err.message}`);
    }
  };

  const toggleApplicantSelection = (applicantId: string) => {
    setSelectedApplicants(prev => {
      if (prev.includes(applicantId)) {
        return prev.filter(id => id !== applicantId);
      } else {
        return [...prev, applicantId];
      }
    });
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsProfileOpen(true);
  };

  const handleViewCoverLetter = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsCoverLetterOpen(true);
  };

  const handleMessageApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsMessageOpen(true);
  };

  return {
    selectedApplicants,
    selectAll,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    date,
    setDate,
    selectedApplicant,
    isProfileOpen,
    setIsProfileOpen,
    isCoverLetterOpen,
    setIsCoverLetterOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    isMessageOpen,
    setIsMessageOpen,
    filteredApplicants,
    handleStatusChange,
    handleDeleteApplicant,
    toggleApplicantSelection,
    toggleSelectAll,
    handleViewApplicant,
    handleViewCoverLetter,
    handleMessageApplicant
  };
};
