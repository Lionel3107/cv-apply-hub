
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Building,
  Menu,
  X,
  Search,
  Briefcase,
  User,
  LogOut,
  Home,
  Info,
  FileText,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useUnreadMessages } from "@/hooks/use-unread-messages";

export const Header = () => {
  const { user, profile, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = useUnreadMessages();

  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error signing out: ${error.message}`);
      } else {
        toast.error("Error signing out");
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getProfileInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-blue">
            <Logo className="h-8 w-8" />
            <span className="hidden sm:inline">DimKoff</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Home
            </Link>
            <Link to="/jobs" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Find Jobs
            </Link>
            <Link to="/companies" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              Companies
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              About Us
            </Link>
            {user && profile?.is_employer && (
              <Link to="/post-job" className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
                Post Job
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Message notification for companies */}
            {user && profile?.is_employer && (
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="relative">
                  <Mail className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 h-auto rounded-full">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback>{getProfileInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-medium">
                      {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {profile?.is_employer ? (
                    <Link to="/dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Company Dashboard</span>
                        {unreadCount > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <Link to="/applicant-dashboard">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button>Sign in</Button>
              </Link>
            )}

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
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
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center px-3 py-2 rounded-md hover:bg-red-50 text-red-600"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
