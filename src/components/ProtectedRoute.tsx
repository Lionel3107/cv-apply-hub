
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: "employer" | "applicant";
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a role is required, check the user's role
  if (requiredRole) {
    console.log("Required role:", requiredRole);
    console.log("User profile:", profile);
    
    // Workaround for new users who might not have profile data fully loaded
    if (!profile) {
      console.log("Profile not loaded yet, allowing access temporarily");
      return <>{children}</>;
    }
    
    // If employer is required but user is not an employer
    if (requiredRole === "employer" && !profile?.is_employer) {
      console.log("User is not an employer, redirecting to applicant dashboard");
      return <Navigate to="/applicant-dashboard" replace />;
    }
    
    // If applicant is required but user is an employer
    if (requiredRole === "applicant" && profile?.is_employer) {
      console.log("User is an employer, redirecting to employer dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
