import { Job } from "@/types/job";

// Function to convert jobs data to CSV format
export const exportJobsToCSV = (jobs: Job[]): string => {
  // Define CSV headers
  const headers = [
    "Title",
    "Type",
    "Location",
    "Category",
    "Posted Date",
    "Status",
    "Applications"
  ];

  // Create CSV header row
  let csvContent = headers.join(",") + "\n";

  // Add data rows
  jobs.forEach(job => {
    const row = [
      `"${job.title.replace(/"/g, '""')}"`,
      `"${job.type.replace(/"/g, '""')}"`,
      `"${job.location.replace(/"/g, '""')}"`,
      `"${job.category || "".replace(/"/g, '""')}"`,
      `"${new Date(job.postedDate).toLocaleDateString()}"`,
      `"${job.featured ? "Featured" : "Active"}"`,
      `"${job.applicationCount || 0}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
};

// Function to download data as a file
export const downloadFile = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to export jobs to CSV and trigger download
export const exportJobsData = (jobs: Job[]): void => {
  const csvData = exportJobsToCSV(jobs);
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0];
  downloadFile(csvData, `job-listings-${timestamp}.csv`, "text/csv");
};

// Function to export applicant data to CSV
export const exportApplicantsToCSV = (applicants: any[]): string => {
  // Define CSV headers
  const headers = [
    "Name",
    "Email",
    "Job Title",
    "Applied Date",
    "Status",
    "Skills"
  ];

  // Create CSV header row
  let csvContent = headers.join(",") + "\n";

  // Add data rows
  applicants.forEach(applicant => {
    const row = [
      `"${applicant.name.replace(/"/g, '""')}"`,
      `"${applicant.email.replace(/"/g, '""')}"`,
      `"${applicant.jobTitle.replace(/"/g, '""')}"`,
      `"${new Date(applicant.appliedDate).toLocaleDateString()}"`,
      `"${applicant.action}"`,
      `"${(applicant.skills || []).join(", ").replace(/"/g, '""')}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
};

// Function to export applicants to CSV and trigger download
export const exportApplicantsData = (applicants: any[], jobTitle?: string): void => {
  const csvData = exportApplicantsToCSV(applicants);
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0];
  const filename = jobTitle 
    ? `applicants-${jobTitle.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.csv` 
    : `applicants-${timestamp}.csv`;
  downloadFile(csvData, filename, "text/csv");
};
