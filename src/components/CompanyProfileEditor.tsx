import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Building, Upload, X, Camera, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const CompanyProfileEditor = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    email: "",
    phone: "",
    industry: "",
    company_size: "",
    founded_year: "",
    linkedin_url: "",
    twitter_url: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    console.log("CompanyProfileEditor - Profile:", profile);
    console.log("CompanyProfileEditor - Company ID:", profile?.company_id);
    fetchCompanyData();
  }, [profile?.company_id]);

  const fetchCompanyData = async () => {
    console.log("Fetching company data...");
    console.log("Profile:", profile);
    console.log("Company ID:", profile?.company_id);

    if (!profile?.company_id) {
      console.log("No company_id found in profile, trying to find company by email");
      
      // Try to find company by user's email
      if (profile?.email) {
        try {
          setIsLoading(true);
          console.log("Querying companies table with email:", profile.email);
          
          const { data, error } = await supabase
            .from("companies")
            .select("*")
            .eq("email", profile.email)
            .single();

          console.log("Company query by email result:", { data, error });

          if (error) {
            console.error("Database error:", error);
            throw error;
          }

          if (data) {
            console.log("Company data found by email:", data);
            setCompany(data);
            setFormData({
              name: data.name || "",
              description: data.description || "",
              website: data.website || "",
              location: data.location || "",
              email: data.email || "",
              phone: data.phone || "",
            });
            setLogoPreview(data.logo_url || null);
            
            // Update the profile with the company_id
            await supabase
              .from("profiles")
              .update({ company_id: data.id })
              .eq("id", profile.id);
            
            return;
          }
        } catch (error) {
          console.error("Error fetching company by email:", error);
        }
      }
      
      console.log("No company found by email either");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Querying companies table with ID:", profile.company_id);
      
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", profile.company_id)
        .single();

      console.log("Company query result:", { data, error });

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      if (!data) {
        console.log("No company data found");
        setIsLoading(false);
        return;
      }

      console.log("Company data found:", data);
      setCompany(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        website: data.website || "",
        location: data.location || "",
        email: data.email || "",
        phone: data.phone || "",
      });
      setLogoPreview(data.logo_url || null);
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Failed to load company information");
    } finally {
      setIsLoading(false);
    }
  };

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

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
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
    } catch (error) {
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
      
      let logoUrl = company.logo_url;
      
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
      
      // Update local state
      setCompany(prev => ({
        ...prev,
        ...formData,
        logo_url: logoUrl
      }));
      
      toast.success("Company profile updated successfully");
      setLogoFile(null);
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error("Failed to update company profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-600">Loading company profile...</p>
          <p className="text-sm text-gray-500 mt-2">
            {profile?.company_id ? "Fetching company data..." : "Looking for your company..."}
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Company Found</h3>
            <p className="text-gray-600 mb-4">
              Unable to load company information. This might happen if:
            </p>
            <ul className="text-sm text-gray-500 space-y-1 mb-4">
              <li>• Your company profile hasn't been created yet</li>
              <li>• There was an issue during the signup process</li>
              <li>• The company data is not properly linked to your account</li>
            </ul>
            <div className="space-y-2">
              <p className="text-xs text-gray-400">
                Profile ID: {profile?.id || "Not available"}
              </p>
              <p className="text-xs text-gray-400">
                Company ID: {profile?.company_id || "Not set"}
              </p>
              <p className="text-xs text-gray-400">
                Email: {profile?.email || "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
          <p className="text-gray-600 mt-1">
            Update your company information and branding
          </p>
        </div>
        {isSaving && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">Saving...</span>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo Section */}
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={isUploadingLogo}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  {logoFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearLogo}
                      disabled={isUploadingLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Recommended: 400x400px (max 2MB)
                </p>
              </div>
              
              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1"
                    placeholder="Tell applicants about your company, mission, and values..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="contact@yourcompany.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="submit" 
                disabled={isSaving || isUploadingLogo}
                className="bg-brand-blue hover:bg-brand-darkBlue"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 