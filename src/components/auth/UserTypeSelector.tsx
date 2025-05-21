
import { Building, User } from "lucide-react";

type UserType = "applicant" | "company";

interface UserTypeSelectorProps {
  userType: UserType;
  onChange: (type: UserType) => void;
}

const UserTypeSelector = ({ userType, onChange }: UserTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div
        className={`cursor-pointer rounded-xl p-6 text-center transition-all ${
          userType === "applicant" 
            ? "bg-brand-blue/10 border-2 border-brand-blue" 
            : "bg-white border border-gray-200 hover:border-brand-blue/50"
        }`}
        onClick={() => onChange("applicant")}
      >
        <div className="flex justify-center mb-3">
          <div className={`p-3 rounded-full ${
            userType === "applicant" ? "bg-brand-blue/20" : "bg-gray-100"
          }`}>
            <User className={`h-6 w-6 ${
              userType === "applicant" ? "text-brand-blue" : "text-gray-500"
            }`} />
          </div>
        </div>
        <h3 className={`font-medium ${
          userType === "applicant" ? "text-brand-blue" : "text-gray-900"
        }`}>
          I'm a Job Seeker
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Looking for job opportunities
        </p>
      </div>
      
      <div
        className={`cursor-pointer rounded-xl p-6 text-center transition-all ${
          userType === "company" 
            ? "bg-brand-blue/10 border-2 border-brand-blue" 
            : "bg-white border border-gray-200 hover:border-brand-blue/50"
        }`}
        onClick={() => onChange("company")}
      >
        <div className="flex justify-center mb-3">
          <div className={`p-3 rounded-full ${
            userType === "company" ? "bg-brand-blue/20" : "bg-gray-100"
          }`}>
            <Building className={`h-6 w-6 ${
              userType === "company" ? "text-brand-blue" : "text-gray-500"
            }`} />
          </div>
        </div>
        <h3 className={`font-medium ${
          userType === "company" ? "text-brand-blue" : "text-gray-900"
        }`}>
          I'm an Employer
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Looking to hire talent
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelector;
