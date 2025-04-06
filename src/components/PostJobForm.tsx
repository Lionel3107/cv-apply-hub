
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, MapPin, Building, Tag, DollarSign, Calendar, Globe, Mail, Phone } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Creating a schema for job posting validation
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Job type must be at least 2 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  description: z.string().min(30, {
    message: "Description must be at least 30 characters.",
  }),
  requirements: z.string().min(20, {
    message: "Requirements must be at least 20 characters.",
  }),
  benefits: z.string().min(20, {
    message: "Benefits must be at least 20 characters.",
  }),
  salary: z.string().optional(),
  companyWebsite: z.string().optional(),
  companyEmail: z.string().email().optional(),
  companyPhone: z.string().optional(),
  companyDescription: z.string().optional(),
  isRemote: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PostJobFormProps {
  onJobPosted: () => void;
}

export function PostJobForm({ onJobPosted }: PostJobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const { profile } = useAuth();

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: profile?.company_id ? "" : "", // Will be filled automatically for employers with company
      location: "",
      type: "Full-time",
      category: "Technology",
      description: "",
      requirements: "",
      benefits: "",
      salary: "",
      companyWebsite: "",
      companyEmail: "",
      companyPhone: "",
      companyDescription: "",
      isRemote: false,
      featured: false,
    },
  });

  // If the user is an employer with a company, pre-fill the company name
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (profile?.company_id) {
        try {
          const { data, error } = await supabase
            .from('companies')
            .select('name, website, email, phone, description')
            .eq('id', profile.company_id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            form.setValue('company', data.name);
            form.setValue('companyWebsite', data.website || '');
            form.setValue('companyEmail', data.email || '');
            form.setValue('companyPhone', data.phone || '');
            form.setValue('companyDescription', data.description || '');
          }
        } catch (error) {
          console.error('Error fetching company details:', error);
        }
      }
    };
    
    fetchCompanyDetails();
  }, [profile, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // First ensure the user has a company
      let companyId = profile?.company_id;
      
      if (!companyId) {
        // Create a new company if the user doesn't have one
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: values.company,
            website: values.companyWebsite,
            email: values.companyEmail,
            phone: values.companyPhone,
            description: values.companyDescription
          })
          .select('id')
          .single();
          
        if (companyError) throw companyError;
        
        companyId = companyData.id;
        
        // Update the user's profile with the new company_id and set is_employer to true
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            company_id: companyId,
            is_employer: true 
          })
          .eq('id', profile?.id || '');
          
        if (profileError) throw profileError;
      }
      
      // Insert the job into the database
      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          title: values.title,
          company_id: companyId,
          location: values.location,
          type: values.type,
          category: values.category,
          description: values.description,
          requirements: values.requirements.split('\n').filter(item => item.trim() !== ''),
          benefits: values.benefits.split('\n').filter(item => item.trim() !== ''),
          salary: values.salary,
          is_remote: values.isRemote,
          is_featured: values.featured,
          tags: [values.type, values.category],
          posted_date: new Date().toISOString(),
        });
        
      if (jobError) throw jobError;
      
      // Call the onJobPosted callback
      onJobPosted();
    } catch (error: any) {
      console.error('Error posting job:', error);
      alert(`Failed to post job: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="e.g. Software Engineer" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        placeholder="e.g. Acme Inc." 
                        className="pl-10" 
                        {...field} 
                        disabled={!!profile?.company_id}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="e.g. New York, NY" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="e.g. $80,000 - $100,000" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="e.g. Full-time, Part-time" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Category</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input placeholder="e.g. Technology, Marketing" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="isRemote"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remote Position</FormLabel>
                    <FormDescription>
                      Check if this job can be done remotely
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Job</FormLabel>
                    <FormDescription>
                      Check to highlight this job in search results
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Job Details</h2>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the responsibilities and details of the job"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include key responsibilities, technologies used, team structure, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List the requirements for this job (one per line)"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include skills, experience, education, certifications needed (one per line)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List the benefits offered (one per line)"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include perks, health insurance, PTO, work environment benefits (one per line)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <div 
            className="flex justify-between items-center border-b pb-2 cursor-pointer"
            onClick={() => setShowCompanyProfile(!showCompanyProfile)}
          >
            <h2 className="text-xl font-semibold">Company Profile</h2>
            <Button type="button" variant="ghost" size="sm">
              {showCompanyProfile ? "Hide" : "Show"}
            </Button>
          </div>
          
          {showCompanyProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="e.g. https://www.company.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="e.g. info@company.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="e.g. (123) 456-7890" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyDescription"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your company, culture, mission, etc."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed to applicants when they view your company profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-brand-blue hover:bg-brand-darkBlue"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting Job..." : "Post Job"}
        </Button>
      </form>
    </Form>
  );
}
