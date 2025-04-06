
export type ApplicationStatus = "new" | "shortlisted" | "interviewed" | "rejected" | "hired";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  userId?: string;
  jobTitle: string;
  appliedDate: string;
  resumeUrl: string;
  action: ApplicationStatus;
  skills: string[];
  experience: string;
  education: string;
  coverLetter: string;
  companyName?: string;
  companyLogo?: string;
  phone?: string;
}

export interface ApplicantWithScore extends Applicant {
  score: number;
  avatar?: string;
}

export interface ApplicantApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  appliedDate: string;
  status: ApplicationStatus;
  statusUpdates: { status: ApplicationStatus; date: string }[];
  feedback: string | null;
  nextSteps: string | null;
}

export interface StatusUpdate {
  status: ApplicationStatus;
  date: string;
}
