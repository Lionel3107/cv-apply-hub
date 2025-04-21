
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const ApplicantDashboardProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "Kabore Lionel",
    email: "dimkoff@gmail.com",
    phone: "+226 75 15 66 88",
    location: "Ouagadougou, Burkina Faso",
    title: "Full Stack Developer",
    about: "Passionate full stack developer with 5 years of experience building modern web applications.",
    profilePictureUrl: "",
    website: "https://dimkoff.com",
    linkedin: "https://linkedin.com/in/dimkoff",
    github: "https://github.com/lionel3107"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={formData.profilePictureUrl} alt={formData.fullName} />
                  <AvatarFallback className="text-3xl">
                    {formData.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm">
                  Upload Photo
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="about">About Me</Label>
                  <Textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Social Profiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
