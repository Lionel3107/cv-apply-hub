
import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Info,
  FileText,
  Briefcase,
  Building,
  User,
  LogOut
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Profile {
  is_employer: boolean;
}

interface User {
  email?: string;
}

interface MobileMenuProps {
  user: User | null;
  profile: Profile | null;
  unreadCount: number;
  onSignOut: () => void;
}

export const MobileMenu = ({ user, profile, unreadCount, onSignOut }: MobileMenuProps) => {
  return (
    <nav className="md:hidden pt-4 pb-2 border-t mt-3 space-y-2">
      <Link to="/" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
        <Home className="mr-2 h-5 w-5" />
        Home
      </Link>
      <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
        <Briefcase className="mr-2 h-5 w-5" />
        Find Jobs
      </Link>
      <Link to="/companies" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
        <Building className="mr-2 h-5 w-5" />
        Companies
      </Link>
      <Link to="/about" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
        <Info className="mr-2 h-5 w-5" />
        About Us
      </Link>
      {user && (
        <>
          {profile?.is_employer ? (
            <>
              <Link to="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <Building className="mr-2 h-5 w-5" />
                Company Dashboard
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
              <Link to="/post-job" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                <FileText className="mr-2 h-5 w-5" />
                Post Job
              </Link>
            </>
          ) : (
            <Link to="/applicant-dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              <User className="mr-2 h-5 w-5" />
              My Dashboard
            </Link>
          )}
          <button 
            onClick={onSignOut}
            className="w-full text-left flex items-center px-3 py-2 rounded-md hover:bg-red-50 text-red-600"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign out
          </button>
        </>
      )}
    </nav>
  );
};
