
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Form schema
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSignIn?: () => void;
}

const SignInForm = ({ onSignIn }: SignInFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
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
      
      if (onSignIn) onSignIn();
    } catch (error: any) {
      toast.error(`Failed to sign in: ${error.message || "An error occurred"}`);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-5">
        <FormField
          control={form.control}
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
          control={form.control}
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
  );
};

export default SignInForm;
