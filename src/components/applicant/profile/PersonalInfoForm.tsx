
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PersonalInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PersonalInfoForm = ({ formData, onInputChange }: PersonalInfoFormProps) => {
  return (
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Email cannot be changed here
          </p>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={onInputChange}
          placeholder="e.g., New York, NY"
        />
      </div>
      <div>
        <Label htmlFor="bio">About Me</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onInputChange}
          rows={4}
          placeholder="Tell companies about yourself, your experience, and what you're looking for..."
        />
      </div>
    </div>
  );
};
