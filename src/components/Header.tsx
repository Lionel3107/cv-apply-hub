
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { Menu, X, ChevronDown, LogOut, User, Building, MessageSquare, FileText } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useMobile();
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    } else if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Find Jobs" },
    { path: "/companies", label: "Companies" },
  ];

  const renderDesktopNav = () => (
    <div className="container mx-auto px-4 flex items-center justify-between py-4">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          <span className="text-brand-blue">Job</span>Board
        </Link>
        <NavigationMenu className="hidden md:flex ml-10">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link to={item.path} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {profile?.is_employer ? (
              <Link to="/post-job">
                <Button variant="outline" className="hidden md:inline-flex">
                  <FileText className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </Link>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    {profile?.avatar_url ? (
                      <div className="bg-cover bg-center h-full w-full" style={{ backgroundImage: `url(${profile.avatar_url})` }} />
                    ) : (
                      <AvatarFallback className="bg-brand-blue text-white">
                        {getInitials()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="font-medium">
                  <User className="mr-2 h-4 w-4" />
                  <span>
                    {profile?.first_name
                      ? `${profile.first_name} ${profile.last_name || ""}`
                      : user.email}
                  </span>
                </DropdownMenuItem>
                {profile?.is_employer ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <Building className="mr-2 h-4 w-4" />
                      <span>Company Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/post-job")}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Post Job</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate("/applicant-dashboard")}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>My Applications</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link to="/auth">
            <Button className="bg-brand-blue hover:bg-brand-darkBlue">Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );

  const renderMobileNav = () => (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          <span className="text-brand-blue">Job</span>Board
        </Link>
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-600 focus:outline-none focus:text-gray-800"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white pt-16">
          <div className="container mx-auto px-4">
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 p-2 text-gray-600 focus:outline-none focus:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>

            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-md text-lg",
                    location.pathname === item.path
                      ? "bg-gray-100 font-medium"
                      : "text-gray-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="border-t border-gray-200 my-4 pt-4">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <Avatar className="h-10 w-10">
                        {profile?.avatar_url ? (
                          <div className="bg-cover bg-center h-full w-full" style={{ backgroundImage: `url(${profile.avatar_url})` }} />
                        ) : (
                          <AvatarFallback className="bg-brand-blue text-white">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {profile?.first_name
                            ? `${profile.first_name} ${profile.last_name || ""}`
                            : user.email}
                        </p>
                      </div>
                    </div>

                    {profile?.is_employer ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                          <Building className="mr-2 h-4 w-4" />
                          Company Dashboard
                        </Link>
                        <Link
                          to="/post-job"
                          className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Post Job
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/applicant-dashboard"
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        My Applications
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/auth" className="mt-4">
                  <Button className="w-full bg-brand-blue hover:bg-brand-darkBlue">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {isMobile ? renderMobileNav() : renderDesktopNav()}
    </header>
  );
};

export default Header;
