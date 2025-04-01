
import { Applicant } from "@/types/applicant";

export const mockApplicants: Applicant[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    jobTitle: "Senior Frontend Developer",
    appliedDate: "2023-10-15",
    resumeUrl: "#",
    status: "new",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experience: "5 years",
    education: "BS Computer Science",
    ranking: 4.5,
    coverLetter: "I am excited to apply for the Senior Frontend Developer position. With 5 years of experience building modern web applications using React, TypeScript, and Next.js, I believe I would be a valuable addition to your team. I'm particularly interested in your company because of your focus on user experience and innovative products."
  },
  {
    id: "2",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    jobTitle: "UX Designer",
    appliedDate: "2023-10-14",
    resumeUrl: "#",
    status: "interviewed",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    experience: "3 years",
    education: "MA Design",
    ranking: 4.0,
    coverLetter: "As a UX Designer with 3 years of experience, I'm passionate about creating intuitive and engaging user experiences. I've worked on various projects ranging from e-commerce to healthcare applications, always focusing on user needs and business goals. I'm excited about the possibility of bringing my skills to your team."
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    jobTitle: "Product Manager",
    appliedDate: "2023-10-13",
    resumeUrl: "#",
    status: "rejected",
    skills: ["Agile", "Scrum", "Product Strategy", "User Stories"],
    experience: "7 years",
    education: "MBA",
    ranking: 3.0,
    coverLetter: "I am writing to express my interest in the Product Manager position. With 7 years of experience in product management across various industries, I have a proven track record of delivering successful products that meet both user needs and business objectives. My approach to product management is data-driven and user-centered."
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    jobTitle: "Backend Developer",
    appliedDate: "2023-10-12",
    resumeUrl: "#",
    status: "new",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    experience: "4 years",
    education: "MS Computer Engineering",
    ranking: 4.8,
    coverLetter: "I'm applying for the Backend Developer role at your company. With 4 years of specialized experience in Node.js and cloud infrastructure, I've built scalable systems that handle millions of requests daily. I'm particularly impressed by your company's innovative approach to technology and would love to contribute to your team."
  },
  {
    id: "5",
    name: "David Lee",
    email: "david.lee@example.com",
    jobTitle: "Marketing Specialist",
    appliedDate: "2023-10-11",
    resumeUrl: "#",
    status: "shortlisted",
    skills: ["SEO", "Content Marketing", "Social Media", "Analytics"],
    experience: "2 years",
    education: "BS Marketing",
    ranking: 3.5,
    coverLetter: "I am excited to apply for the Marketing Specialist position. With 2 years of experience in digital marketing, I've developed successful marketing campaigns that have increased brand awareness and customer engagement. I'm particularly interested in your company's focus on sustainable products and would love to contribute to your mission."
  }
];
