
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, BarChart, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserApplications } from "@/hooks/use-applications";
import { supabase } from "@/integrations/supabase/client";

export const ApplicantDashboardFeedback = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { applications, isLoading } = useUserApplications();
  
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
    
    if (!user) {
      toast.error("You must be logged in to submit feedback");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("feedback")
        .insert({
          user_id: user.id,
          feedback_text: feedbackText,
          rating: selectedRating,
        });
      
      if (error) throw error;
      
      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      setSelectedRating("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate analytics based on real application data
  const analytics = useMemo(() => {
    if (!applications || applications.length === 0) {
      return {
        totalApplications: 0,
        shortlisted: 0,
        interviewed: 0,
        rejected: 0,
        hired: 0,
        profileStrength: 0,
        suggestions: []
      };
    }

    const totalApplications = applications.length;
    const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
    const interviewed = applications.filter(app => app.status === 'interviewed').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const hired = applications.filter(app => app.status === 'hired').length;
    
    // Calculate profile strength based on applications performance
    let profileStrength = 50; // Base score
    
    if (totalApplications > 0) {
      const shortlistRate = shortlisted / totalApplications;
      const interviewRate = interviewed / totalApplications;
      const successRate = hired / totalApplications;
      
      profileStrength += (shortlistRate * 20) + (interviewRate * 20) + (successRate * 10);
    }
    
    // Generate suggestions based on performance
    const suggestions = [];
    if (shortlisted / totalApplications < 0.3) {
      suggestions.push({
        type: "warning",
        title: "Improve your application approach",
        description: "Your shortlisting rate is low. Consider tailoring your applications better."
      });
    }
    if (interviewed / totalApplications < 0.2) {
      suggestions.push({
        type: "warning", 
        title: "Enhance your profile",
        description: "Add more relevant skills and experience to stand out."
      });
    }
    if (hired > 0) {
      suggestions.push({
        type: "success",
        title: "Great job!",
        description: "You've successfully landed job offers. Keep up the good work!"
      });
    }
    
    return {
      totalApplications,
      shortlisted,
      interviewed,
      rejected,
      hired,
      profileStrength: Math.min(100, Math.round(profileStrength)),
      suggestions
    };
  }, [applications]);
  
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
          {isLoading ? (
            <div className="text-center py-8">Loading analytics...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Applications Submitted</span>
                      <span className="font-medium">{analytics.totalApplications}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Shortlisted</span>
                      <span className="font-medium">{analytics.shortlisted}</span>
                    </div>
                    <Progress 
                      value={analytics.totalApplications > 0 ? (analytics.shortlisted / analytics.totalApplications) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Interviews</span>
                      <span className="font-medium">{analytics.interviewed}</span>
                    </div>
                    <Progress 
                      value={analytics.totalApplications > 0 ? (analytics.interviewed / analytics.totalApplications) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rejected</span>
                      <span className="font-medium">{analytics.rejected}</span>
                    </div>
                    <Progress 
                      value={analytics.totalApplications > 0 ? (analytics.rejected / analytics.totalApplications) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hired</span>
                      <span className="font-medium">{analytics.hired}</span>
                    </div>
                    <Progress 
                      value={analytics.totalApplications > 0 ? (analytics.hired / analytics.totalApplications) * 100 : 0} 
                      className="h-2" 
                    />
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
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {analytics.profileStrength}%
                      </span>
                    </div>
                    <Progress value={analytics.profileStrength} className="h-2" />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Performance Insights</h4>
                    <div className="space-y-3">
                      {analytics.suggestions.length > 0 ? (
                        analytics.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`${
                              suggestion.type === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                            } p-1 rounded-full mr-3 mt-0.5`}>
                              <ThumbsUp className={`h-4 w-4 ${
                                suggestion.type === 'success' ? 'text-green-600' : 'text-yellow-600'
                              }`} />
                            </div>
                            <div className="text-sm">
                              <p className="font-medium">{suggestion.title}</p>
                              <p className="text-gray-500">{suggestion.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">
                          {analytics.totalApplications === 0 
                            ? "Submit your first application to see personalized insights!" 
                            : "Your profile looks good! Keep applying to more positions."}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
