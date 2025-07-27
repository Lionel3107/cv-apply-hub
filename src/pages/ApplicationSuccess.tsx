
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ApplicationSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for applying. Your application has been successfully submitted. 
            We'll review your qualifications and get back to you soon.
          </p>
          
          {/* AI Consent Confirmation */}
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Brain className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>AI Processing Confirmed:</strong> Your application materials will be analyzed by our AI system 
              to help recruiters evaluate your profile effectively. Your data is protected and secure.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <Button asChild className="w-full bg-brand-blue hover:bg-brand-darkBlue">
              <Link to="/">Browse More Jobs</Link>
            </Button>
            <Button 
              variant="outline" 
              asChild 
              className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
            >
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationSuccess;
