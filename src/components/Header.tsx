
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
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
            <Button className="bg-brand-blue hover:bg-brand-darkBlue">
              Post a Job
            </Button>
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
            <Button 
              className="bg-brand-blue hover:bg-brand-darkBlue mx-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Post a Job
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
