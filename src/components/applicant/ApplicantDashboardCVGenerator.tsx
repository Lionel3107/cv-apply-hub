
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileUp, Download, Zap } from "lucide-react";

export const ApplicantDashboardCVGenerator = () => {
  const [activeTab, setActiveTab] = useState("create");
  
  const handleGenerateCV = (e) => {
    e.preventDefault();
    toast.success("CV generation feature will be implemented soon!");
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="create" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create CV</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your CV</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateCV} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" placeholder="Kabore Lionel" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="dimkoff@example.com" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" placeholder="+226 75 15 66 87" />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" placeholder="Ouagadougou, Burkina Faso" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Professional Summary</h3>
                      <Textarea 
                        placeholder="Write a brief summary of your professional background and goals..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Work Experience</h3>
                        <Button type="button" variant="outline" size="sm">+ Add Experience</Button>
                      </div>
                      {/* Experience fields would be dynamically added here */}
                      <div className="border rounded-md p-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input id="jobTitle" placeholder="Software Engineer" />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" placeholder="Tech Company Inc." />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" />
                          </div>
                          <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="responsibilities">Responsibilities & Achievements</Label>
                          <Textarea 
                            id="responsibilities"
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Education</h3>
                        <Button type="button" variant="outline" size="sm">+ Add Education</Button>
                      </div>
                      {/* Education fields would be dynamically added here */}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Skills</h3>
                        <Button type="button" variant="outline" size="sm">+ Add Skill</Button>
                      </div>
                      {/* Skills fields would be dynamically added here */}
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Generate CV
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>CV Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center text-gray-500 border-2 border-dashed rounded-lg p-4">
                    <p>Your CV preview will appear here</p>
                    <p className="text-sm mt-2">Complete the form to generate a preview</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>CV Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border rounded-md overflow-hidden cursor-pointer hover:border-brand-blue transition-colors">
                    <div className="bg-gray-100 h-48"></div>
                    <div className="p-3">
                      <p className="font-medium">Template {i}</p>
                      <p className="text-sm text-gray-500">Professional {i % 2 === 0 ? 'Modern' : 'Classic'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-assistant" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-brand-blue" />
                AI CV Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Let our AI help you create a professional CV that stands out.</p>
                
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="font-medium mb-2">AI Features:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-brand-blue text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">✓</span>
                      <span>Optimize your resume with industry-specific keywords</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-brand-blue text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">✓</span>
                      <span>Improve your professional summary and experience descriptions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-brand-blue text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">✓</span>
                      <span>Tailor your CV to specific job postings</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                  <Textarea 
                    id="jobDescription"
                    placeholder="Paste a job description here to tailor your CV..."
                    rows={4}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline">
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload Existing CV
                    </Button>
                    <Button>
                      <Zap className="mr-2 h-4 w-4" />
                      Enhance with AI
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
