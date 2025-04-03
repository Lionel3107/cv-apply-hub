
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Video, Users, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

// Mock interview data
const mockInterviews = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    companyName: "TechCorp Inc.",
    date: "2025-04-10T10:00:00",
    format: "video",
    status: "upcoming",
    tips: [
      "Research company products and recent news",
      "Prepare examples of past projects using React",
      "Review common data structure questions",
      "Prepare questions to ask the interviewer"
    ]
  },
  {
    id: "2",
    jobTitle: "UX Designer",
    companyName: "Creative Solutions Ltd.",
    date: "2025-04-15T14:00:00",
    format: "in-person",
    location: "125 Main Street, Suite 400",
    status: "upcoming",
    tips: [
      "Bring your portfolio in digital and print format",
      "Be prepared to discuss your design process",
      "Research the company's design language and UX principles",
      "Prepare to explain how you handle feedback"
    ]
  },
  {
    id: "3",
    jobTitle: "Product Manager",
    companyName: "Innovate Systems",
    date: "2025-04-05T11:00:00",
    format: "video",
    status: "completed",
    tips: [
      "Analyze the product market fit",
      "Prepare your product roadmap presentation",
      "Review competitor analysis",
      "Prepare questions about team structure"
    ]
  }
];

// Mock recommendations
const mockRecommendations = [
  {
    id: "1",
    title: "Technical Interview Preparation",
    category: "Technical",
    resources: [
      {
        title: "Data Structures & Algorithms",
        link: "#",
        type: "Course"
      },
      {
        title: "System Design Interview",
        link: "#",
        type: "Book"
      }
    ]
  },
  {
    id: "2",
    title: "Behavioral Interview Techniques",
    category: "Behavioral",
    resources: [
      {
        title: "STAR Method Framework",
        link: "#",
        type: "Guide"
      },
      {
        title: "Common Behavioral Questions",
        link: "#",
        type: "Article"
      }
    ]
  },
  {
    id: "3",
    title: "Portfolio Preparation",
    category: "Design",
    resources: [
      {
        title: "Portfolio Review Guide",
        link: "#",
        type: "Video"
      },
      {
        title: "Case Study Framework",
        link: "#",
        type: "Template"
      }
    ]
  }
];

export const ApplicantDashboardInterviews = () => {
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>("1");
  
  const toggleInterview = (id: string) => {
    setExpandedInterview(expandedInterview === id ? null : id);
  };
  
  const toggleRecommendation = (id: string) => {
    setExpandedRecommendation(expandedRecommendation === id ? null : id);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Interviews Section - 3/5 width on desktop */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              {mockInterviews.filter(interview => interview.status === "upcoming").length > 0 ? (
                <div className="space-y-4">
                  {mockInterviews
                    .filter(interview => interview.status === "upcoming")
                    .map((interview) => {
                      const { date, time } = formatDate(interview.date);
                      return (
                        <div 
                          key={interview.id} 
                          className="border rounded-lg overflow-hidden bg-white"
                        >
                          <div 
                            className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleInterview(interview.id)}
                          >
                            <div>
                              <h3 className="font-medium text-lg">{interview.jobTitle}</h3>
                              <p className="text-sm text-gray-500">{interview.companyName}</p>
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {date}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {time}
                                </div>
                                <div className="flex items-center">
                                  {interview.format === "video" ? (
                                    <Video className="h-4 w-4 mr-1 text-blue-500" />
                                  ) : (
                                    <Users className="h-4 w-4 mr-1 text-green-500" />
                                  )}
                                  <span className="capitalize">
                                    {interview.format} Interview
                                  </span>
                                </div>
                              </div>
                              {interview.location && (
                                <div className="mt-2 flex items-center text-gray-600 text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {interview.location}
                                </div>
                              )}
                            </div>
                            {expandedInterview === interview.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          
                          {expandedInterview === interview.id && (
                            <div className="p-4 border-t bg-gray-50">
                              <h4 className="font-medium mb-2 flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                                Preparation Tips
                              </h4>
                              <ul className="space-y-2 ml-6 list-disc text-sm text-gray-700">
                                {interview.tips.map((tip, index) => (
                                  <li key={index}>{tip}</li>
                                ))}
                              </ul>
                              <div className="mt-4 flex justify-end">
                                <Button size="sm">Prepare for Interview</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-600">No upcoming interviews</h3>
                  <p className="text-sm">Once you're invited to an interview, it will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Past Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              {mockInterviews.filter(interview => interview.status === "completed").length > 0 ? (
                <div className="space-y-4">
                  {mockInterviews
                    .filter(interview => interview.status === "completed")
                    .map((interview) => {
                      const { date, time } = formatDate(interview.date);
                      return (
                        <div 
                          key={interview.id} 
                          className="border rounded-lg overflow-hidden bg-white"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{interview.jobTitle}</h3>
                                <p className="text-sm text-gray-500">{interview.companyName}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {date}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {time}
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-gray-500">Completed</Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No past interviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recommendations Section - 2/5 width on desktop */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Interview Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg overflow-hidden">
                    <div 
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleRecommendation(rec.id)}
                    >
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge 
                          variant="outline" 
                          className="mt-1 text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {rec.category}
                        </Badge>
                      </div>
                      {expandedRecommendation === rec.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    {expandedRecommendation === rec.id && (
                      <div className="p-3 border-t bg-gray-50">
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Recommended Resources:</h5>
                        <ul className="space-y-2">
                          {rec.resources.map((resource, idx) => (
                            <li key={idx} className="text-sm">
                              <a href={resource.link} className="text-blue-600 hover:underline flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {resource.title}
                                <Badge variant="outline" className="ml-2 text-xs py-0 h-4">
                                  {resource.type}
                                </Badge>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
