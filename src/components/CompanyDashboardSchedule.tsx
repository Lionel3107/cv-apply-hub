
import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Check, X, Clock, ArrowUpRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format, parseISO, isToday, isPast, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { useEvents, Event } from "@/hooks/use-events";
import { useJobs } from "@/hooks/use-jobs";
import { ScheduleJob } from "./ScheduleJob";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const CompanyDashboardSchedule = () => {
  const { events, isLoading } = useEvents();
  const { jobs } = useJobs();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleAddEvent = () => {
    if (jobs.length === 0) {
      toast.error("You need to create a job listing first");
      return;
    }
    
    setSelectedJob(jobs[0]);
    setAddEventDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailsDialogOpen(true);
  };

  const handleUpdateEventStatus = async (eventId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId);
        
      if (error) throw error;
      
      toast.success("Event status updated");
      setEventDetailsDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating event status:", error);
      toast.error(error.message || "Failed to update event status");
    }
  };

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => {
    if (!selectedDate) return false;
    return isSameDay(parseISO(event.date), selectedDate);
  });

  // Filter upcoming events 
  const upcomingEvents = events.filter(event => {
    const eventDate = parseISO(event.date);
    return !isPast(eventDate) || isToday(eventDate);
  }).slice(0, 5);

  // Add event marker to the calendar
  const eventDates = events.map(event => parseISO(event.date));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-medium w-32 text-center">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>Manage your schedule and important dates</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border w-full"
            modifiers={{
              event: (date) => 
                eventDates.some((eventDate) => 
                  isSameDay(date, eventDate) && isSameMonth(date, currentMonth)
                ),
            }}
            modifiersClassNames={{
              event: "relative before:absolute before:w-1.5 before:h-1.5 before:bg-brand-blue before:rounded-full before:top-0 before:left-1/2 before:-translate-x-1/2",
            }}
          />
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-center">
          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </CardTitle>
            <CardDescription>
              {isToday(selectedDate) ? "Today's schedule" : "Events for this date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : selectedDateEvents.length > 0 ? (
              <ScrollArea className="h-[280px]">
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.isAllDay ? (
                            <span>All day</span>
                          ) : (
                            <span>{format(parseISO(event.date), "h:mm a")}</span>
                          )}
                        </div>
                        {event.status && (
                          <Badge
                            className={`mt-2 text-xs ${
                              event.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : event.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <CalendarIcon className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>No events scheduled for this date</p>
                <Button variant="outline" className="mt-4" onClick={handleAddEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center p-2 border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div>
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-500">
                        {isToday(parseISO(event.date))
                          ? "Today"
                          : format(parseISO(event.date), "MMM d")}
                        {!event.isAllDay && `, ${format(parseISO(event.date), "h:mm a")}`}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${
                        event.type === "interview"
                          ? "bg-purple-100 text-purple-800"
                          : event.type === "application_deadline"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.type.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No upcoming events</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={addEventDialogOpen} onOpenChange={setAddEventDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Schedule a new event related to your job listings.
            </DialogDescription>
          </DialogHeader>
          {selectedJob && <ScheduleJob job={selectedJob} onClose={() => setAddEventDialogOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={eventDetailsDialogOpen} onOpenChange={setEventDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{selectedEvent.title}</h3>
                <Badge
                  className={`${
                    selectedEvent.type === "interview"
                      ? "bg-purple-100 text-purple-800"
                      : selectedEvent.type === "application_deadline"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedEvent.type.replace("_", " ")}
                </Badge>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {format(parseISO(selectedEvent.date), "EEEE, MMMM d, yyyy")}
                      </p>
                      {selectedEvent.isAllDay ? (
                        <p className="text-sm text-gray-600">All day</p>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {format(parseISO(selectedEvent.date), "h:mm a")}
                          {selectedEvent.endDate && 
                            ` - ${format(parseISO(selectedEvent.endDate), "h:mm a")}`}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedEvent.description && (
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-gray-700">{selectedEvent.description}</p>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2">Status</h4>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={selectedEvent.status === "pending" ? "default" : "outline"}
                        onClick={() => handleUpdateEventStatus(selectedEvent.id, "pending")}
                      >
                        Pending
                      </Button>
                      <Button 
                        size="sm" 
                        variant={selectedEvent.status === "completed" ? "default" : "outline"}
                        className={selectedEvent.status === "completed" ? "bg-green-600" : ""}
                        onClick={() => handleUpdateEventStatus(selectedEvent.id, "completed")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Completed
                      </Button>
                      <Button 
                        size="sm" 
                        variant={selectedEvent.status === "cancelled" ? "default" : "outline"}
                        className={selectedEvent.status === "cancelled" ? "bg-red-600" : ""}
                        onClick={() => handleUpdateEventStatus(selectedEvent.id, "cancelled")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelled
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
