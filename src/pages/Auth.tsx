
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Building, User } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

// Form schemas
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">("sign-in");
  const [userType, setUserType] = useState<"applicant" | "company">("applicant");
  const { toast: useToastFn } = useToast();
  const navigate = useNavigate();

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Check if the user is an employer to determine which dashboard to redirect to
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_employer')
          .eq('id', authData.user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }
          
        toast.success("Signed in successfully!");
        
        // Make sure we're correctly checking the is_employer flag
        const isEmployer = profileData?.is_employer || false;
        console.log("User is employer:", isEmployer);
        redirectToDashboard(isEmployer);
      }
      
    } catch (error: any) {
      toast.error(`Failed to sign in: ${error.message || "An error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);

      // Register the user with Supabase Auth
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        // Update the profile with is_employer flag based on user type
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_employer: userType === 'company',
            first_name: data.firstName,
            last_name: data.lastName,
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast.success("Account created successfully!");
        
        // If it's a company, we'll redirect to the company signup page for additional details
        if (userType === 'company') {
          navigate('/company-signup');
        } else {
          // For applicants, we can redirect directly to their dashboard
          navigate('/applicant-dashboard');
        }
      }
    } catch (error: any) {
      toast.error(`Failed to create account: ${error.message || "An error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToDashboard = (isEmployer: boolean) => {
    console.log("Redirecting user. Is employer:", isEmployer);
    if (isEmployer) {
      navigate("/dashboard");
    } else {
      navigate("/applicant-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left panel - Login form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h1 className="text-2xl font-bold text-center mb-6">
              {activeTab === "sign-in" ? "Welcome Back" : "Create an Account"}
            </h1>
            
            <Tabs 
              defaultValue="sign-in" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "sign-in" | "sign-up")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sign-in">
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-5">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-darkBlue" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="sign-up">
                {/* User type selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div
                    className={`cursor-pointer rounded-xl p-6 text-center transition-all ${
                      userType === "applicant" 
                        ? "bg-brand-blue/10 border-2 border-brand-blue" 
                        : "bg-white border border-gray-200 hover:border-brand-blue/50"
                    }`}
                    onClick={() => setUserType("applicant")}
                  >
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-full ${
                        userType === "applicant" ? "bg-brand-blue/20" : "bg-gray-100"
                      }`}>
                        <User className={`h-6 w-6 ${
                          userType === "applicant" ? "text-brand-blue" : "text-gray-500"
                        }`} />
                      </div>
                    </div>
                    <h3 className={`font-medium ${
                      userType === "applicant" ? "text-brand-blue" : "text-gray-900"
                    }`}>
                      I'm a Job Seeker
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Looking for job opportunities
                    </p>
                  </div>
                  
                  <div
                    className={`cursor-pointer rounded-xl p-6 text-center transition-all ${
                      userType === "company" 
                        ? "bg-brand-blue/10 border-2 border-brand-blue" 
                        : "bg-white border border-gray-200 hover:border-brand-blue/50"
                    }`}
                    onClick={() => setUserType("company")}
                  >
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-full ${
                        userType === "company" ? "bg-brand-blue/20" : "bg-gray-100"
                      }`}>
                        <Building className={`h-6 w-6 ${
                          userType === "company" ? "text-brand-blue" : "text-gray-500"
                        }`} />
                      </div>
                    </div>
                    <h3 className={`font-medium ${
                      userType === "company" ? "text-brand-blue" : "text-gray-900"
                    }`}>
                      I'm an Employer
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Looking to hire talent
                    </p>
                  </div>
                </div>

                {userType === "applicant" ? (
                  <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={signUpForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signUpForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signUpForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-darkBlue" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-xl p-6 mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Employer Registration
                    </h3>
                    
                    <Form {...signUpForm}>
                      <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={signUpForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={signUpForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={signUpForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            After creating your basic account, you'll be able to set up your company profile and start posting jobs.
                          </p>
                        </div>
                        
                        <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-darkBlue" disabled={isLoading}>
                          {isLoading ? "Creating Account..." : "Create Employer Account"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right panel - Info and benefits */}
          <div className="hidden md:block">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {activeTab === "sign-in" 
                    ? "Welcome back to our platform" 
                    : "Join thousands of professionals"}
                </h2>
                <p className="text-gray-600">
                  {activeTab === "sign-in"
                    ? "Sign in to access your personalized dashboard and continue your career journey."
                    : "Create an account to unlock all features and start your journey with us."}
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    title: "Smart Job Matching",
                    description: "AI-powered matching to connect you with the perfect opportunities"
                  },
                  {
                    title: "Application Tracking",
                    description: "Track all your applications in one place with real-time updates"
                  },
                  {
                    title: "Professional Profile",
                    description: "Create a standout profile that catches recruiters' attention"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 rounded-full bg-brand-blue flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
