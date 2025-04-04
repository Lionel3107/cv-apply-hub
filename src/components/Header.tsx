
import { useState } from 'react';
import { Menu, X, Home, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-brand-blue">
            CVApplyHub
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors flex items-center ${
                isActive('/') && !isActive('/jobs') && !isActive('/companies') && !isActive('/about')
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              <Home size={18} className="mr-1" />
              Home
            </Link>
            <Link 
              to="/jobs" 
              className={`transition-colors ${
                isActive('/jobs') 
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              Jobs
            </Link>
            <Link 
              to="/companies" 
              className={`transition-colors ${
                isActive('/companies') 
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              Companies
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${
                isActive('/about') 
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
            >
              About
            </Link>
            
            {user ? (
              <>
                {profile?.is_employer && (
                  <Link to="/post-job">
                    <Button className="bg-brand-blue hover:bg-brand-darkBlue mr-2">
                      Post a Job
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => 
                      navigate(profile?.is_employer ? '/dashboard' : '/applicant-dashboard')
                    }>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-brand-blue hover:bg-brand-darkBlue">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-4 animate-fade-in">
            <Link 
              to="/" 
              className={`transition-colors py-2 px-4 flex items-center ${
                isActive('/') && !isActive('/jobs') && !isActive('/companies') && !isActive('/about')
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} className="mr-2" />
              Home
            </Link>
            <Link 
              to="/jobs" 
              className={`transition-colors py-2 px-4 ${
                isActive('/jobs') 
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link 
              to="/companies" 
              className={`transition-colors py-2 px-4 ${
                isActive('/companies') 
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Companies
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors py-2 px-4 ${
                isActive('/about') 
                  ? 'text-brand-blue font-medium' 
                  : 'text-gray-700 hover:text-brand-blue'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {user ? (
              <>
                {profile?.is_employer && (
                  <Link to="/post-job" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      className="bg-brand-blue hover:bg-brand-darkBlue mx-4 w-[calc(100%-2rem)]"
                    >
                      Post a Job
                    </Button>
                  </Link>
                )}
                
                <Link 
                  to={profile?.is_employer ? '/dashboard' : '/applicant-dashboard'} 
                  className="transition-colors py-2 px-4 text-gray-700 hover:text-brand-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="inline mr-2" />
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-left transition-colors py-2 px-4 text-gray-700 hover:text-brand-blue w-full"
                >
                  <LogOut size={18} className="inline mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  className="bg-brand-blue hover:bg-brand-darkBlue mx-4 w-[calc(100%-2rem)]"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
