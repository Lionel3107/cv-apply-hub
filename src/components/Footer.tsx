
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-brand-blue mb-4">Dimkoff</h3>
            <p className="text-gray-600 mb-4">
              Connecting talent with opportunities worldwide.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">For Job Seekers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/create-profile" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/job-alerts" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Job Alerts
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">For Employers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Dimkoff. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
