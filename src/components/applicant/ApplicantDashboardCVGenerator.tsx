
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileUp, Download, Zap, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExperienceEntry {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

export const ApplicantDashboardCVGenerator = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<string>("");
  
  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState<ExperienceEntry[]>([
    { jobTitle: "", company: "", startDate: "", endDate: "", responsibilities: "" }
  ]);
  const [education, setEducation] = useState<EducationEntry[]>([
    { degree: "", institution: "", year: "" }
  ]);
  const [skills, setSkills] = useState<string[]>([""]);
  const [jobDescription, setJobDescription] = useState("");

  const addExperience = () => {
    setExperience([...experience, { jobTitle: "", company: "", startDate: "", endDate: "", responsibilities: "" }]);
  };

  const addEducation = () => {
    setEducation([...education, { degree: "", institution: "", year: "" }]);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const updateExperience = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const updateSkill = (index: number, value: string) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const handleCVAction = async (action: 'generate' | 'enhance' | 'tailor') => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cv', {
        body: {
          personalInfo,
          summary,
          experience: experience.filter(exp => exp.jobTitle || exp.company),
          education: education.filter(edu => edu.degree || edu.institution),
          skills: skills.filter(skill => skill.trim()),
          jobDescription: action === 'tailor' ? jobDescription : undefined,
          action
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedCV(data.cvHtml);
        toast.success(`CV ${action}d successfully!`);
      } else {
        throw new Error(data.error || 'Failed to generate CV');
      }
    } catch (error) {
      console.error('Error generating CV:', error);
      toast.error(`Failed to ${action} CV: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCV = () => {
    if (!generatedCV) {
      toast.error("No CV to download. Please generate one first.");
      return;
    }

    const blob = new Blob([generatedCV], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.fullName || 'CV'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CV downloaded successfully!");
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
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input 
                              id="fullName" 
                              placeholder="Kabore Lionel" 
                              value={personalInfo.fullName}
                              onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="dimkoff@example.com" 
                              value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input 
                              id="phone" 
                              placeholder="+226 75 15 66 87" 
                              value={personalInfo.phone}
                              onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input 
                              id="location" 
                              placeholder="Ouagadougou, Burkina Faso" 
                              value={personalInfo.location}
                              onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                            />
                          </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Professional Summary</h3>
                      <Textarea 
                        placeholder="Write a brief summary of your professional background and goals..."
                        rows={4}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Work Experience</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Experience
                        </Button>
                      </div>
                      {experience.map((exp, index) => (
                        <div key={index} className="border rounded-md p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                              <Input 
                                id={`jobTitle-${index}`} 
                                placeholder="Software Engineer" 
                                value={exp.jobTitle}
                                onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`company-${index}`}>Company</Label>
                              <Input 
                                id={`company-${index}`} 
                                placeholder="Tech Company Inc." 
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                              <Input 
                                id={`startDate-${index}`} 
                                type="date" 
                                value={exp.startDate}
                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`endDate-${index}`}>End Date</Label>
                              <Input 
                                id={`endDate-${index}`} 
                                type="date" 
                                value={exp.endDate}
                                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`responsibilities-${index}`}>Responsibilities & Achievements</Label>
                            <Textarea 
                              id={`responsibilities-${index}`}
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                              value={exp.responsibilities}
                              onChange={(e) => updateExperience(index, 'responsibilities', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Education</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Education
                        </Button>
                      </div>
                      {education.map((edu, index) => (
                        <div key={index} className="border rounded-md p-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`degree-${index}`}>Degree</Label>
                              <Input 
                                id={`degree-${index}`} 
                                placeholder="Bachelor of Computer Science" 
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`institution-${index}`}>Institution</Label>
                              <Input 
                                id={`institution-${index}`} 
                                placeholder="University Name" 
                                value={edu.institution}
                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`year-${index}`}>Year</Label>
                            <Input 
                              id={`year-${index}`} 
                              placeholder="2020" 
                              value={edu.year}
                              onChange={(e) => updateEducation(index, 'year', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Skills</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Skill
                        </Button>
                      </div>
                      {skills.map((skill, index) => (
                        <div key={index}>
                          <Input 
                            placeholder="e.g. JavaScript, Project Management, etc." 
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        onClick={() => handleCVAction('generate')} 
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        {isGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="mr-2 h-4 w-4" />
                        )}
                        Generate CV
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => handleCVAction('enhance')} 
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        {isGenerating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="mr-2 h-4 w-4" />
                        )}
                        Enhance CV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>CV Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedCV ? (
                    <div className="space-y-4">
                      <div 
                        className="border rounded-lg p-4 bg-white text-black min-h-[500px] max-h-[600px] overflow-auto"
                        dangerouslySetInnerHTML={{ __html: generatedCV }}
                      />
                      <Button onClick={downloadCV} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download CV
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center text-gray-500 border-2 border-dashed rounded-lg p-4">
                      <p>Your CV preview will appear here</p>
                      <p className="text-sm mt-2">Complete the form and click "Generate CV" to see a preview</p>
                    </div>
                  )}
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
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline">
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload Existing CV
                    </Button>
                    <Button 
                      onClick={() => handleCVAction('tailor')} 
                      disabled={isGenerating || !jobDescription.trim()}
                    >
                      {isGenerating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      Tailor CV to Job
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
