
export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  category: string;
  tags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  postedDate: string;
  featured: boolean;
  isRemote: boolean;
  companyProfile?: {
    website?: string;
    email?: string;
    phone?: string;
    description?: string;
  };
}
