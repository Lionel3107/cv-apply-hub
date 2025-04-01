
export interface Applicant {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  appliedDate: string;
  resumeUrl: string;
  status: "new" | "shortlisted" | "interviewed" | "rejected";
  skills: string[];
  experience: string;
  education: string;
  ranking: number;
  coverLetter: string;
}
