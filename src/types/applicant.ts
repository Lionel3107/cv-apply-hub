
export interface Applicant {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  appliedDate: string;
  resumeUrl: string;
  action: "new" | "shortlisted" | "interviewed" | "rejected" | "hired";
  skills: string[];
  experience: string;
  education: string;
  coverLetter: string;
}
