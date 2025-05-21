
interface AuthBenefitsProps {
  isSignIn: boolean;
}

const AuthBenefits = ({ isSignIn }: AuthBenefitsProps) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isSignIn 
            ? "Welcome back to our platform" 
            : "Join thousands of professionals"}
        </h2>
        <p className="text-gray-600">
          {isSignIn
            ? "Sign in to access your personalized dashboard and continue your career journey."
            : "Create an account to unlock all features and start your journey with us."}
        </p>
      </div>
      
      <div className="space-y-4">
        {[
          {
            title: "Smart Job Matching",
            description: "AI-powered matching to connect you with the perfect opportunities"
          },
          {
            title: "Application Tracking",
            description: "Track all your applications in one place with real-time updates"
          },
          {
            title: "Professional Profile",
            description: "Create a standout profile that catches recruiters' attention"
          }
        ].map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <div className="h-5 w-5 rounded-full bg-brand-blue flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthBenefits;
