
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  isEmployer: z.boolean().default(false),
  companyName: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">("sign-in");
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      isEmployer: false,
      companyName: "",
    },
  });

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchIsEmployer = signUpForm.watch("isEmployer");

  const handleSignUp = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            is_employer: data.isEmployer,
            company_name: data.companyName,
          },
        },
      });

      if (error) throw error;

      if (data.isEmployer && data.companyName) {
        // Create company record
        const { error: companyError } = await supabase
          .from('companies')
          .insert([
            { 
              name: data.companyName,
              email: data.email,
            }
          ]);
          
        if (companyError) throw companyError;
        
        // Update the user's profile with company_id
        // This requires a separate query after creation
        if (authData.user) {
          const { data: companyData } = await supabase
            .from('companies')
            .select('id')
            .eq('name', data.companyName)
            .eq('email', data.email)
            .single();
            
          if (companyData) {
            await supabase
              .from('profiles')
              .update({ 
                company_id: companyData.id,
                is_employer: true 
              })
              .eq('id', authData.user.id);
          }
        }
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      
      // Redirect to the appropriate dashboard
      redirectToDashboard(data.isEmployer);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create account",
        description: error.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_employer')
          .eq('id', authData.user.id)
          .single();
          
        toast({
          title: "Signed in successfully!",
          description: "Welcome back!",
        });
        
        redirectToDashboard(profileData?.is_employer || false);
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to sign in",
        description: error.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToDashboard = (isEmployer: boolean) => {
    if (isEmployer) {
      navigate("/dashboard");
    } else {
      navigate("/applicant-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h1 className="text-2xl font-bold text-center mb-6">
              {activeTab === "sign-in" ? "Sign In" : "Create an Account"}
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
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
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
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <FormField
                        control={signUpForm.control}
                        name="isEmployer"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>I'm an employer</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
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
                    
                    {watchIsEmployer && (
                      <FormField
                        control={signUpForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
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
                    
                    <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-darkBlue" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
