
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-brand-blue">
            CVApplyHub
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-blue transition-colors">
              Jobs
            </Link>
            <Link to="/companies" className="text-gray-700 hover:text-brand-blue transition-colors">
              Companies
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-blue transition-colors">
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
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-4 animate-fade-in">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-brand-blue transition-colors py-2 px-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link 
              to="/companies" 
              className="text-gray-700 hover:text-brand-blue transition-colors py-2 px-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Companies
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-brand-blue transition-colors py-2 px-4"
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
