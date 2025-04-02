
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Linkedin, FileText, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ApplicantDashboardLinkedInImport = () => {
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isImported, setIsImported] = useState(false);
  
  const handleImport = async (e) => {
    e.preventDefault();
    
    if (!linkedInUrl.includes('linkedin.com')) {
      toast.error("Please enter a valid LinkedIn URL");
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Simulate API call to generate CV from LinkedIn
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsImported(true);
      toast.success("LinkedIn profile imported successfully!");
      
      // Simulate downloading the generated CV after a delay
      setTimeout(() => {
        toast.info("CV generated from your LinkedIn profile");
      }, 1000);
    } catch (error) {
      toast.error("Failed to import LinkedIn profile");
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Import from LinkedIn</CardTitle>
              <CardDescription>
                Generate your CV automatically from your LinkedIn profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImport} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Linkedin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="linkedin-url"
                        placeholder="https://www.linkedin.com/in/your-profile"
                        className="pl-10"
                        value={linkedInUrl}
                        onChange={(e) => setLinkedInUrl(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!linkedInUrl || isImporting}
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : isImported ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Imported
                        </>
                      ) : (
                        "Import"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">How it works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3">
                      <Linkedin className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium mb-1">Step 1</h4>
                    <p className="text-sm text-gray-600">Paste your LinkedIn profile URL</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3">
                      <Loader2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium mb-1">Step 2</h4>
                    <p className="text-sm text-gray-600">We parse your experience & skills</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium mb-1">Step 3</h4>
                    <p className="text-sm text-gray-600">Download your professional CV</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="text-sm text-gray-500">
                By importing, you agree to our terms of service
              </div>
              <Button variant="ghost" onClick={() => window.open("https://www.linkedin.com", "_blank")}>
                Visit LinkedIn
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Save Time</h4>
                  <p className="text-sm text-gray-600">No need to manually enter your work history</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Professional Format</h4>
                  <p className="text-sm text-gray-600">Get a well-structured, ATS-friendly CV</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Easy Updates</h4>
                  <p className="text-sm text-gray-600">Keep your CV synchronized with your LinkedIn profile</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Multiple Formats</h4>
                  <p className="text-sm text-gray-600">Download as PDF, Word, or plain text</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
