
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
    // If employer is required but user is not an employer
    if (requiredRole === "employer" && !profile?.is_employer) {
      return <Navigate to="/applicant-dashboard" replace />;
    }
    
    // If applicant is required but user is an employer
    if (requiredRole === "applicant" && profile?.is_employer) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
