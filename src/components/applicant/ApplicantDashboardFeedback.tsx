
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, BarChart, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { toast } from "sonner";

export const ApplicantDashboardFeedback = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    
    if (!selectedRating) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to submit feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      setSelectedRating("");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList>
          <TabsTrigger value="submit">
            <MessageCircle className="h-4 w-4 mr-2" />
            Submit Feedback
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Application Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Give Us Your Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="feedback">Share your experience</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us what you think about our platform and how we can improve it..."
                    className="min-h-[150px]"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>How would you rate your experience?</Label>
                  <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="excellent" />
                      <Label htmlFor="excellent" className="cursor-pointer flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                        Excellent
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="good" />
                      <Label htmlFor="good" className="cursor-pointer">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="average" id="average" />
                      <Label htmlFor="average" className="cursor-pointer">Average</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="poor" />
                      <Label htmlFor="poor" className="cursor-pointer flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                        Poor
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Applications Submitted</span>
                    <span className="font-medium">12</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Viewed by Employers</span>
                    <span className="font-medium">9</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Shortlisted</span>
                    <span className="font-medium">5</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Interviews</span>
                    <span className="font-medium">3</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Offers</span>
                    <span className="font-medium">1</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Strength</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Overall Profile</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Improvement Suggestions</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-0.5">
                        <ThumbsUp className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Add more skills to your profile</p>
                        <p className="text-gray-500">Try to add at least 5 more skills related to your industry</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-0.5">
                        <ThumbsUp className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Complete your education details</p>
                        <p className="text-gray-500">Add your complete academic history</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Great job adding project details</p>
                        <p className="text-gray-500">Your project portfolio is impressive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
