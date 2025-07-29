
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: "employer" | "applicant";
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();

  console.log("ProtectedRoute - User:", user?.id);
  console.log("ProtectedRoute - Profile:", profile);
  console.log("ProtectedRoute - Required Role:", requiredRole);
  console.log("ProtectedRoute - Is Loading:", isLoading);

  if (isLoading) {
    console.log("ProtectedRoute - Showing loading spinner");
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  // If a role is required, check the user's role
  if (requiredRole) {
    console.log("Required role:", requiredRole);
    console.log("User profile:", profile);
    console.log("Profile is_employer:", profile?.is_employer);
    console.log("Profile company_id:", profile?.company_id);
    
    // For new users, wait a bit longer for profile to load
    if (!profile) {
      console.log("Profile not loaded yet, showing loading...");
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds after signup</p>
          </div>
        </div>
      );
    }
    
    // If employer is required but user is not an employer
    if (requiredRole === "employer" && !profile?.is_employer) {
      console.log("User is not an employer, redirecting to applicant dashboard");
      console.log("Profile details:", {
        id: profile.id,
        is_employer: profile.is_employer,
        company_id: profile.company_id,
        email: profile.email
      });
      return <Navigate to="/applicant-dashboard" replace />;
    }
    
    // If applicant is required but user is an employer
    if (requiredRole === "applicant" && profile?.is_employer) {
      console.log("User is an employer, redirecting to employer dashboard");
      console.log("Profile details:", {
        id: profile.id,
        is_employer: profile.is_employer,
        company_id: profile.company_id,
        email: profile.email
      });
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("ProtectedRoute - Allowing access to protected route");
  return <>{children}</>;
};

export default ProtectedRoute;
