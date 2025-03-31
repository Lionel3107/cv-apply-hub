
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScheduledEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "interview" | "meeting" | "deadline" | "other";
}

export const CompanyDashboardSchedule = () => {
  const [events, setEvents] = useState<ScheduledEvent[]>([
    {
      id: "1",
      title: "Interview with John Doe",
      date: "2023-11-16",
      time: "10:00",
      type: "interview",
    },
    {
      id: "2",
      title: "Team Planning Meeting",
      date: "2023-11-17",
      time: "14:00",
      type: "meeting",
    },
    {
      id: "3",
      title: "Job Posting Deadline",
      date: "2023-11-20",
      time: "18:00",
      type: "deadline",
    },
    {
      id: "4",
      title: "Interview with Sarah Johnson",
      date: "2023-11-18",
      time: "11:30",
      type: "interview",
    },
  ]);

  const [newEvent, setNewEvent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState<"interview" | "meeting" | "deadline" | "other">("interview");
  const [isAdding, setIsAdding] = useState(false);

  const addEvent = () => {
    if (newEvent.trim() === "") return;
    
    const event: ScheduledEvent = {
      id: Date.now().toString(),
      title: newEvent,
      date: newDate || new Date().toISOString().split("T")[0],
      time: newTime || "09:00",
      type: newType,
    };
    
    setEvents([...events, event]);
    setNewEvent("");
    setNewDate("");
    setNewTime("");
    setIsAdding(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "interview":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Interview</Badge>;
      case "meeting":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Meeting</Badge>;
      case "deadline":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Deadline</Badge>;
      case "other":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Other</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return a.time.localeCompare(b.time);
  });

  // Group events by date
  const eventsByDate: Record<string, ScheduledEvent[]> = {};
  sortedEvents.forEach((event) => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Schedule</h2>
        {!isAdding && (
          <Button
            className="bg-brand-blue hover:bg-brand-darkBlue"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Event title"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as "interview" | "meeting" | "deadline" | "other")}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="interview">Interview</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button className="bg-brand-blue hover:bg-brand-darkBlue" onClick={addEvent}>
                  Add Event
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.keys(eventsByDate).length === 0 && (
              <div className="text-center py-8 text-gray-500">No scheduled events</div>
            )}
            
            {Object.keys(eventsByDate).map((date) => (
              <div key={date} className="mb-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-brand-blue" />
                  <h3 className="font-medium text-gray-900">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                </div>
                
                <div className="space-y-3 pl-7">
                  {eventsByDate[date].map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getEventTypeBadge(event.type)}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
