
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUnreadMessages } from "@/hooks/use-unread-messages";
import { MessageNotification } from "@/components/header/MessageNotification";
import { UserDropdown } from "@/components/header/UserDropdown";
import { MobileMenu } from "@/components/header/MobileMenu";

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
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-blue">
            <Logo className="h-8 w-8" />
            <span className="hidden sm:inline">JobPortal</span>
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
              <MessageNotification unreadCount={unreadCount} />
            )}

            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <UserDropdown 
                user={user} 
                profile={profile} 
                unreadCount={unreadCount} 
                onSignOut={handleSignOut} 
              />
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
          <MobileMenu 
            user={user} 
            profile={profile} 
            unreadCount={unreadCount} 
            onSignOut={handleSignOut} 
          />
        )}
      </div>
    </header>
  );
};
