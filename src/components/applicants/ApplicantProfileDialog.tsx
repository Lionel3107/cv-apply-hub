
import React, { useState } from "react";
import { Applicant } from "@/types/applicant";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Mail, MapPin, Phone, User, MessageCircle, FileText, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApplicantProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
}

export const ApplicantProfileDialog = ({
  open,
  onOpenChange,
  applicant,
}: ApplicantProfileDialogProps) => {
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  
  if (!applicant) return null;

  const getActionBadge = (action: string) => {
    switch (action) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "shortlisted":
        return <Badge className="bg-purple-500">Shortlisted</Badge>;
      case "interviewed":
        return <Badge className="bg-orange-500">Interviewed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "hired":
        return <Badge className="bg-green-500">Hired</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    // In a real app, this would send the message to the applicant
    toast.success(`Message sent to ${applicant.name}`);
    setMessage("");
    setShowMessageForm(false);
  };

  const handleDownloadResume = () => {
    if (applicant.resumeUrl) {
      window.open(applicant.resumeUrl, '_blank');
    } else {
      toast.error("No resume available for download");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Applicant Profile</DialogTitle>
          <DialogDescription>
            Detailed information about {applicant.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="flex-grow overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-grow pr-4">
            <TabsContent value="profile" className="mt-0 h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
                      <User className="h-16 w-16" />
                    </div>
                    <h3 className="font-semibold text-lg text-center">{applicant.name}</h3>
                    <div className="mt-2">{getActionBadge(applicant.action)}</div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-500">About</h4>
                      <p className="mt-1">{applicant.experience || "No experience information provided."}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{applicant.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{applicant.phone || "Not provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Not specified</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{applicant.jobTitle}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Applied {new Date(applicant.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {applicant.skills.length > 0 ? (
                          applicant.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-100">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 italic">No skills listed</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Education</h4>
                      <p>
                        {applicant.education || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="resume" className="mt-0 h-full">
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-md min-h-[300px] flex flex-col items-center justify-center">
                  {applicant.resumeUrl ? (
                    <>
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-center mb-4">Resume is available for this applicant.</p>
                      <Button onClick={handleDownloadResume}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 italic">No resume was provided for this application.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cover-letter" className="mt-0 h-full">
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-md whitespace-pre-line font-serif min-h-[300px]">
                  {applicant.coverLetter ? (
                    applicant.coverLetter
                  ) : (
                    <p className="text-gray-500 italic text-center py-10">
                      No cover letter was provided for this application.
                    </p>
                  )}
                </div>
                
                {applicant.coverLetter && (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => window.print()}>
                      Print
                    </Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {showMessageForm ? (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Send Message to Applicant</h4>
            <Textarea
              placeholder="Write your message here..."
              className="min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={() => setShowMessageForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                Send Message
              </Button>
            </div>
          </div>
        ) : (
          <DialogFooter className="mt-4 border-t pt-4 flex justify-between sm:justify-between flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowMessageForm(true)}
              className="flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" />
              Message Applicant
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
