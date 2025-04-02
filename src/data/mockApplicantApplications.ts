
import { ApplicantApplication } from "@/types/applicant";

export const mockApplicantApplications: ApplicantApplication[] = [
  {
    id: "1",
    jobId: "job-1",
    jobTitle: "Frontend Developer",
    companyName: "Tech Solutions Inc.",
    companyLogo: "/company-logos/tech-solutions.svg",
    appliedDate: "2023-11-10",
    status: "shortlisted",
    statusUpdates: [
      { status: "new", date: "2023-11-10" },
      { status: "shortlisted", date: "2023-11-15" }
    ],
    feedback: null,
    nextSteps: "We will contact you for an interview soon."
  },
  {
    id: "2",
    jobId: "job-2",
    jobTitle: "UX Designer",
    companyName: "Creative Designs Co.",
    companyLogo: "/company-logos/creative-designs.svg",
    appliedDate: "2023-11-05",
    status: "interviewed",
    statusUpdates: [
      { status: "new", date: "2023-11-05" },
      { status: "shortlisted", date: "2023-11-08" },
      { status: "interviewed", date: "2023-11-12" }
    ],
    feedback: "Great portfolio and interview, we're considering your application.",
    nextSteps: "Second interview with the design team next week."
  },
  {
    id: "3",
    jobId: "job-3",
    jobTitle: "Full Stack Developer",
    companyName: "Innovative Software Ltd.",
    companyLogo: "/company-logos/innovative-software.svg",
    appliedDate: "2023-10-28",
    status: "rejected",
    statusUpdates: [
      { status: "new", date: "2023-10-28" },
      { status: "shortlisted", date: "2023-11-02" },
      { status: "interviewed", date: "2023-11-08" },
      { status: "rejected", date: "2023-11-15" }
    ],
    feedback: "We appreciated your skills but decided to move forward with candidates who have more experience with our specific tech stack.",
    nextSteps: null
  },
  {
    id: "4",
    jobId: "job-4",
    jobTitle: "Backend Engineer",
    companyName: "DataSystems Corp.",
    companyLogo: "/company-logos/datasystems.svg",
    appliedDate: "2023-11-01",
    status: "hired",
    statusUpdates: [
      { status: "new", date: "2023-11-01" },
      { status: "shortlisted", date: "2023-11-03" },
      { status: "interviewed", date: "2023-11-07" },
      { status: "hired", date: "2023-11-20" }
    ],
    feedback: "Excellent technical skills and great cultural fit.",
    nextSteps: "Onboarding starts on December 1st."
  },
  {
    id: "5",
    jobId: "job-5",
    jobTitle: "Product Manager",
    companyName: "FutureVision Inc.",
    companyLogo: "/company-logos/futurevision.svg",
    appliedDate: "2023-11-18",
    status: "new",
    statusUpdates: [
      { status: "new", date: "2023-11-18" }
    ],
    feedback: null,
    nextSteps: null
  }
];
