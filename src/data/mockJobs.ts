
import { Job } from "@/types/job";

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    companyLogo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=100&h=100&auto=format&fit=crop",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "Technology",
    tags: ["React", "TypeScript", "UI/UX"],
    description: "We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building high-quality, responsive web applications using modern web technologies.",
    requirements: [
      "5+ years of experience in frontend development",
      "Strong knowledge of React, TypeScript, and modern JavaScript",
      "Experience with responsive design and CSS frameworks",
      "Understanding of web performance optimization",
      "Ability to write clean, maintainable code"
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Flexible working hours",
      "Remote work options",
      "Professional development opportunities"
    ],
    salary: "$120K - $150K",
    postedDate: "2 days ago",
    featured: true,
    isRemote: true
  },
  {
    id: "2",
    title: "Product Designer",
    company: "DesignHub",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100&h=100&auto=format&fit=crop",
    location: "New York, NY",
    type: "Full-time",
    category: "Design",
    tags: ["UI/UX", "Figma", "Product Design"],
    description: "DesignHub is seeking a talented Product Designer to help shape the future of our platform. You'll work closely with product managers and engineers to design intuitive and beautiful user experiences.",
    requirements: [
      "3+ years of experience in product design",
      "Proficiency with design tools like Figma and Sketch",
      "Strong portfolio showcasing UX process and UI skills",
      "Ability to translate user needs into design solutions",
      "Experience with user research and testing"
    ],
    benefits: [
      "Competitive salary and equity",
      "Comprehensive benefits package",
      "Creative work environment",
      "Latest design tools and resources",
      "Regular team events and activities"
    ],
    salary: "$90K - $120K",
    postedDate: "1 week ago",
    featured: true,
    isRemote: false
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "DataInsights",
    companyLogo: "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Boston, MA",
    type: "Full-time",
    category: "Technology",
    tags: ["Python", "Machine Learning", "SQL"],
    description: "Join our data science team to develop innovative solutions using machine learning and statistical analysis. You'll work on challenging problems and help drive data-informed decisions.",
    requirements: [
      "MS or PhD in a quantitative field",
      "Strong programming skills in Python",
      "Experience with machine learning frameworks",
      "Knowledge of SQL and data processing",
      "Ability to communicate complex findings"
    ],
    benefits: [
      "Competitive compensation",
      "Health and wellness programs",
      "Continuous learning opportunities",
      "Flexible work arrangements",
      "Collaborative team environment"
    ],
    salary: "$110K - $140K",
    postedDate: "3 days ago",
    featured: true,
    isRemote: true
  },
  {
    id: "4",
    title: "Marketing Manager",
    company: "GrowthLabs",
    companyLogo: "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Chicago, IL",
    type: "Full-time",
    category: "Marketing",
    tags: ["Digital Marketing", "SEO", "Content Strategy"],
    description: "We're looking for a Marketing Manager to develop and implement marketing strategies to promote our products and services. You'll be responsible for leading marketing campaigns from concept to execution.",
    requirements: [
      "5+ years of experience in marketing",
      "Proven track record of successful marketing campaigns",
      "Experience with digital marketing channels",
      "Strong analytical and project management skills",
      "Excellent communication abilities"
    ],
    benefits: [
      "Competitive salary",
      "Performance bonuses",
      "Professional development budget",
      "Comprehensive health benefits",
      "Work-life balance initiatives"
    ],
    salary: "$85K - $110K",
    postedDate: "1 week ago",
    featured: false,
    isRemote: false
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    companyLogo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Austin, TX",
    type: "Full-time",
    category: "Engineering",
    tags: ["AWS", "Docker", "CI/CD"],
    description: "CloudTech is seeking a skilled DevOps Engineer to help build and maintain our cloud infrastructure. You'll work on automating processes, improving system reliability, and scaling our architecture.",
    requirements: [
      "3+ years of experience in DevOps or similar role",
      "Strong knowledge of AWS or similar cloud platforms",
      "Experience with containerization (Docker, Kubernetes)",
      "Proficiency with CI/CD pipelines",
      "Scripting and automation skills"
    ],
    benefits: [
      "Competitive compensation package",
      "Flexible working arrangements",
      "Health and wellness benefits",
      "Continuous learning opportunities",
      "Regular team building activities"
    ],
    salary: "$100K - $130K",
    postedDate: "2 weeks ago",
    featured: true,
    isRemote: true
  },
  {
    id: "6",
    title: "Sales Representative",
    company: "SalesForce",
    companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Denver, CO",
    type: "Full-time",
    category: "Sales",
    tags: ["B2B Sales", "CRM", "Client Relations"],
    description: "Join our sales team to help generate new business opportunities and maintain client relationships. You'll be responsible for the full sales cycle, from prospecting to closing deals.",
    requirements: [
      "2+ years of sales experience",
      "Strong communication and negotiation skills",
      "Goal-oriented mindset",
      "Experience with CRM software",
      "Ability to work independently and as part of a team"
    ],
    benefits: [
      "Base salary plus commission",
      "Health and dental insurance",
      "Sales training and development",
      "Company events and incentives",
      "Career advancement opportunities"
    ],
    salary: "$60K - $90K + Commission",
    postedDate: "5 days ago",
    featured: false,
    isRemote: false
  },
  {
    id: "7",
    title: "Backend Engineer",
    company: "ServerStack",
    companyLogo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Seattle, WA",
    type: "Full-time",
    category: "Technology",
    tags: ["Node.js", "API Design", "Databases"],
    description: "We're looking for a Backend Engineer to design and build scalable server-side applications. You'll be responsible for developing APIs, implementing business logic, and optimizing database performance.",
    requirements: [
      "4+ years of backend development experience",
      "Proficiency with Node.js or similar technologies",
      "Experience with RESTful API design",
      "Knowledge of database systems",
      "Understanding of system architecture"
    ],
    benefits: [
      "Competitive salary",
      "Health and retirement benefits",
      "Professional growth opportunities",
      "Flexible work schedule",
      "Collaborative team environment"
    ],
    salary: "$110K - $140K",
    postedDate: "3 days ago",
    featured: true,
    isRemote: true
  },
  {
    id: "8",
    title: "HR Manager",
    company: "PeopleFirst",
    companyLogo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Atlanta, GA",
    type: "Full-time",
    category: "Business",
    tags: ["Recruiting", "Employee Relations", "HR Policies"],
    description: "PeopleFirst is seeking an experienced HR Manager to oversee all aspects of human resources operations. You'll be responsible for recruitment, employee relations, policy development, and more.",
    requirements: [
      "5+ years of HR experience",
      "Knowledge of HR laws and regulations",
      "Experience with recruitment and onboarding",
      "Strong interpersonal and communication skills",
      "Problem-solving abilities"
    ],
    benefits: [
      "Competitive salary and benefits package",
      "Professional development opportunities",
      "Positive work culture",
      "Work-life balance",
      "Career advancement potential"
    ],
    salary: "$85K - $110K",
    postedDate: "2 weeks ago",
    featured: false,
    isRemote: false
  },
  {
    id: "9",
    title: "Project Manager",
    company: "AgileTeam",
    companyLogo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Portland, OR",
    type: "Full-time",
    category: "Business",
    tags: ["Agile", "Project Management", "Team Leadership"],
    description: "AgileTeam is looking for a Project Manager to lead cross-functional teams and ensure the successful delivery of projects. You'll be responsible for planning, execution, monitoring, and project closure.",
    requirements: [
      "3+ years of project management experience",
      "PMP certification or equivalent preferred",
      "Experience with Agile methodologies",
      "Strong leadership and communication skills",
      "Ability to manage multiple projects simultaneously"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive benefits package",
      "Professional development opportunities",
      "Flexible work arrangements",
      "Collaborative work environment"
    ],
    salary: "$90K - $120K",
    postedDate: "1 week ago",
    featured: true,
    isRemote: true
  },
  {
    id: "10",
    title: "Content Writer",
    company: "WordCraft",
    companyLogo: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=100&h=100&auto=format&fit=crop",
    location: "Miami, FL",
    type: "Part-time",
    category: "Marketing",
    tags: ["Content Creation", "SEO", "Copywriting"],
    description: "WordCraft is seeking a talented Content Writer to create engaging and informative content for our clients. You'll be responsible for writing blog posts, articles, web copy, and social media content.",
    requirements: [
      "2+ years of content writing experience",
      "Strong writing and editing skills",
      "Knowledge of SEO best practices",
      "Ability to adapt to different tones and styles",
      "Research capabilities"
    ],
    benefits: [
      "Competitive hourly rate",
      "Flexible schedule",
      "Remote work option",
      "Growth opportunities",
      "Diverse writing projects"
    ],
    salary: "$25 - $35 per hour",
    postedDate: "4 days ago",
    featured: false,
    isRemote: true
  }
];
