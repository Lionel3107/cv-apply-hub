import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
});

export default function CompanySignupForm({ onSuccess }) {
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasSuccessfullySignedUp, setHasSuccessfullySignedUp] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
    },
  });

  // Remove real-time email checking to prevent false positives
  // We'll only check during form submission

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Step 1: Try to create user account
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            // Remove first_name and last_name since we simplified the form
          },
        },
      });

      if (userError) {
        // Handle specific error cases
        if (userError.message.includes("already registered") || userError.message.includes("already exists")) {
          toast.error("This email is already registered. Please use a different email or sign in with your existing account.");
          return;
        }
        throw userError;
      }

      // Step 2: Create company
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: values.companyName,
          email: values.email,
        })
        .select();

      if (companyError) {
        // If company creation fails, we should clean up the user account
        if (userData.user) {
          await supabase.auth.admin.deleteUser(userData.user.id);
        }
        throw companyError;
      }

      // Step 3: Update user profile with company_id and is_employer flag
      console.log("Updating user profile with company_id:", companyData[0].id);
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          company_id: companyData[0].id,
          is_employer: true,
        })
        .eq("id", userData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        // If profile update fails, clean up both user and company
        if (userData.user) {
          await supabase.auth.admin.deleteUser(userData.user.id);
        }
        if (companyData[0]) {
          await supabase.from("companies").delete().eq("id", companyData[0].id);
        }
        throw profileError;
      }

      console.log("Profile updated successfully");

      // Step 4: Refresh the profile to ensure is_employer flag is set
      // Wait a moment for the database to update
      console.log("Waiting for database to update...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased wait time
      
      // Force refresh the profile using AuthContext
      console.log("Refreshing profile via AuthContext...");
      await refreshProfile();
      
      // Also verify the profile was updated correctly
      console.log("Verifying profile update...");
      const { data: refreshedProfile, error: refreshError } = await supabase
        .from("profiles")
        .select('*')
        .eq("id", userData.user.id)
        .single();
        
      if (refreshError) {
        console.error("Error refreshing profile:", refreshError);
      } else {
        console.log("Refreshed profile:", refreshedProfile);
        console.log("is_employer flag:", refreshedProfile.is_employer);
        console.log("company_id:", refreshedProfile.company_id);
      }

      // Additional verification - check if the profile is properly set
      if (!refreshedProfile?.is_employer) {
        console.error("Profile is_employer flag is still false!");
        toast.error("Account created but profile update failed. Please contact support.");
        return;
      }

      toast.success("Company account created successfully!");
      setHasSuccessfullySignedUp(true);
      onSuccess();
    } catch (error) {
      console.error("Signup error:", error);
      
      // Provide more specific error messages
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please use a different email or sign in with your existing account.");
      } else if (error.message.includes("already exists")) {
        toast.error("This email is already in use. Please use a different email address.");
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* emailExists && !hasSuccessfullySignedUp && ( // Removed
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-2">
                <p>
                  <strong>This email is already registered.</strong>
                </p>
                <div className="space-y-1 text-sm">
                  <p>You have a few options:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <Link to="/auth" className="underline font-medium">
                        Sign in with your existing account
                      </Link>
                    </li>
                    <li>Use a different email address for this company</li>
                    <li>Contact support if you need to recover your account</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ) */}
        
        {hasSuccessfullySignedUp && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Account created successfully!</strong> You can now fill in your company information below.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company Information</h3>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading || hasSuccessfullySignedUp}>
          {isLoading ? "Creating Account..." : "Create Company Account"}
        </Button>
      </form>
    </Form>
  );
}