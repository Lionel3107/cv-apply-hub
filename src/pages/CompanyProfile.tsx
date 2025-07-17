
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, MapPin, Mail, Phone, Globe, ArrowLeft, 
  Briefcase, Calendar, Users, Edit, Loader2, Camera 
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import JobCard from "@/components/JobCard";
import { useCompanyJobs } from "@/hooks/use-company-jobs";

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const { jobs, company, isLoading, error } = useCompanyJobs(id);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    email: "",
    phone: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  const isOwner = user && profile?.company_id === id;
  
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        location: company.location || "",
        email: company.email || "",
        phone: company.phone || "",
      });
      setLogoPreview(company.logo || null);
    }
  }, [company]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file is too large. Maximum size is 2MB.");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Selected file is not an image.");
        return;
      }
      
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !company) return null;

    setIsUploadingLogo(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${company.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, logoFile);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return publicURL.publicUrl;
    } catch (error: unknown) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
      return null;
    } finally {
      setIsUploadingLogo(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company) return;
    
    try {
      setIsSaving(true);
      
      let logoUrl = company.logo;
      
      if (logoFile) {
        logoUrl = await uploadLogo();
        if (!logoUrl) return; // Upload failed
      }
      
      const { error } = await supabase
        .from("companies")
        .update({
          name: formData.name,
          description: formData.description || null,
          website: formData.website || null,
          location: formData.location || null,
          email: formData.email || null,
          phone: formData.phone || null,
          logo_url: logoUrl,
        })
        .eq("id", company.id);
        
      if (error) throw error;
      
      toast.success("Company profile updated successfully");
      setIsEditing(false);
      setLogoFile(null);
    } catch (error: unknown) {
      console.error("Error updating company profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update company profile";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-8 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/companies" className="inline-flex items-center text-brand-blue hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
              <span className="ml-2 text-gray-600">Loading company profile...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading company</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : company ? (
            <>
              <Card className="mb-12">
                <CardContent className="p-0">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="p-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 flex flex-col items-center">
                          <div className="relative w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4 group">
                            {logoPreview ? (
                              <img 
                                src={logoPreview} 
                                alt={`${formData.name} logo`} 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Building className="h-16 w-16 text-gray-400" />
                            )}
                            {isUploadingLogo && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-white" />
                              </div>
                            )}
                            <label htmlFor="logo-upload" className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100">
                              <Camera className="h-8 w-8 text-white" />
                            </label>
                          </div>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                            disabled={isUploadingLogo}
                          />
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Click to upload logo<br />
                            Recommended: 400x400px (max 2MB)
                          </p>
                        </div>
                        
                        <div className="flex-1 space-y-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                              Company Name *
                            </label>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                              Company Description
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                              placeholder="Tell applicants about your company, mission, and values..."
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                Website
                              </label>
                              <input
                                id="website"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="https://yourcompany.com"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                              </label>
                              <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="e.g., San Francisco, CA"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Email
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="contact@yourcompany.com"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                              </label>
                              <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                          </div>
                          
                          <div className="pt-4 flex justify-end gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsEditing(false)}
                              disabled={isSaving}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving || isUploadingLogo}>
                              {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 flex flex-col items-center">
                          <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {company.logo ? (
                              <img 
                                src={company.logo} 
                                alt={`${company.name} logo`} 
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Building className="h-16 w-16 text-gray-400" />
                            )}
                          </div>
                          
                          {isOwner && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-4"
                              onClick={() => setIsEditing(true)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                            
                            {isOwner && (
                              <Link to="/dashboard">
                                <Button>
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  Dashboard
                                </Button>
                              </Link>
                            )}
                          </div>
                          
                          {company.description && (
                            <p className="text-gray-600 mb-8">{company.description}</p>
                          )}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            {company.website && (
                              <a 
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-700 hover:text-brand-blue"
                              >
                                <Globe size={18} className="mr-2 text-gray-500" />
                                <span>{company.website.replace(/^https?:\/\//, '')}</span>
                              </a>
                            )}
                            
                            {company.location && (
                              <div className="flex items-center text-gray-700">
                                <MapPin size={18} className="mr-2 text-gray-500" />
                                <span>{company.location}</span>
                              </div>
                            )}
                            
                            {company.email && (
                              <a 
                                href={`mailto:${company.email}`}
                                className="flex items-center text-gray-700 hover:text-brand-blue"
                              >
                                <Mail size={18} className="mr-2 text-gray-500" />
                                <span>{company.email}</span>
                              </a>
                            )}
                            
                            {company.phone && (
                              <a 
                                href={`tel:${company.phone}`}
                                className="flex items-center text-gray-700 hover:text-brand-blue"
                              >
                                <Phone size={18} className="mr-2 text-gray-500" />
                                <span>{company.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mb-8">
                <Tabs defaultValue="jobs">
                  <TabsList className="mb-6">
                    <TabsTrigger value="jobs">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Jobs
                    </TabsTrigger>
                    <TabsTrigger value="about">
                      <Building className="h-4 w-4 mr-2" />
                      About
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="jobs">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Jobs at {company.name}
                    </h2>
                    
                    {jobs.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs available</h3>
                        <p className="text-gray-600">
                          This company doesn't have any job openings at the moment.
                        </p>
                        
                        {isOwner && (
                          <Link to="/post-job">
                            <Button className="mt-4">
                              Post a Job
                            </Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                          <JobCard key={job.id} job={job} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="about">
                    <Card>
                      <CardHeader>
                        <CardTitle>About {company.name}</CardTitle>
                        <CardDescription>Company information and details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {company.description ? (
                          <div className="prose max-w-none">
                            <p>{company.description}</p>
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            No company description available.
                          </p>
                        )}
                        
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                            <div className="space-y-2">
                              {company.email && (
                                <div className="flex items-center text-gray-600">
                                  <Mail className="h-4 w-4 mr-2" />
                                  <span>{company.email}</span>
                                </div>
                              )}
                              {company.phone && (
                                <div className="flex items-center text-gray-600">
                                  <Phone className="h-4 w-4 mr-2" />
                                  <span>{company.phone}</span>
                                </div>
                              )}
                              {company.website && (
                                <div className="flex items-center text-gray-600">
                                  <Globe className="h-4 w-4 mr-2" />
                                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">
                                    {company.website.replace(/^https?:\/\//, '')}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {company.location && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{company.location}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Company not found</h3>
              <p className="text-gray-600 mb-4">
                The company you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/companies">
                <Button>Browse All Companies</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyProfile;
