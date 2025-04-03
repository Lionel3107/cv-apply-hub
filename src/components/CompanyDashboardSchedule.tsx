
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ScheduledEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "interview" | "meeting" | "deadline" | "other";
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
}

export const CompanyDashboardSchedule = () => {
  const [activeTab, setActiveTab] = useState("schedule");
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
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review job applications",
      dueDate: "2023-11-15",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      title: "Schedule interviews",
      dueDate: "2023-11-18",
      status: "pending",
      priority: "medium",
    },
    {
      id: "3",
      title: "Update job description",
      dueDate: "2023-11-20",
      status: "completed",
      priority: "low",
    },
    {
      id: "4",
      title: "Team meeting for hiring",
      dueDate: "2023-11-22",
      status: "pending",
      priority: "high",
    },
  ]);

  // Calendar direct add modal states
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);
  const [addType, setAddType] = useState<"event" | "task">("event");
  
  const [newEvent, setNewEvent] = useState("");
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState<"interview" | "meeting" | "deadline" | "other">("interview");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  
  const [newTask, setNewTask] = useState("");
  const [newTaskDate, setNewTaskDate] = useState<Date | undefined>(undefined);
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const addEvent = () => {
    if (newEvent.trim() === "" || !newEventDate) return;
    
    const event: ScheduledEvent = {
      id: Date.now().toString(),
      title: newEvent,
      date: format(newEventDate, "yyyy-MM-dd"),
      time: newTime || "09:00",
      type: newType,
    };
    
    setEvents([...events, event]);
    setNewEvent("");
    setNewEventDate(undefined);
    setNewTime("");
    setIsAddingEvent(false);
  };
  
  const addTask = () => {
    if (newTask.trim() === "" || !newTaskDate) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      dueDate: format(newTaskDate, "yyyy-MM-dd"),
      status: "pending",
      priority: newPriority,
    };
    
    setTasks([...tasks, task]);
    setNewTask("");
    setNewTaskDate(undefined);
    setIsAddingTask(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
          : task
      )
    );
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
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Function to handle calendar date selection
  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Open dialog for adding event or task directly
      setSelectedCalendarDate(selectedDate);
      setCalendarDialogOpen(true);
      
      // Set the selected date for the new event/task
      setDate(selectedDate);
      setSelectedDate(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  // Function to handle adding event/task from calendar dialog
  const handleAddFromCalendar = () => {
    if (addType === "event") {
      if (newEvent.trim() === "") return;
      
      const event: ScheduledEvent = {
        id: Date.now().toString(),
        title: newEvent,
        date: format(selectedCalendarDate!, "yyyy-MM-dd"),
        time: newTime || "09:00",
        type: newType,
      };
      
      setEvents([...events, event]);
      setNewEvent("");
    } else {
      if (newTask.trim() === "") return;
      
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        dueDate: format(selectedCalendarDate!, "yyyy-MM-dd"),
        status: "pending",
        priority: newPriority,
      };
      
      setTasks([...tasks, task]);
      setNewTask("");
    }
    
    setCalendarDialogOpen(false);
  };

  // Function to check if date has events or tasks
  const dateHasItems = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const hasEvents = events.some(event => event.date === dateStr);
    const hasTasks = tasks.some(task => task.dueDate === dateStr);
    return hasEvents || hasTasks;
  };

  // Get events and tasks for the selected date
  const eventsForSelectedDate = events.filter(event => event.date === selectedDate);
  const tasksForSelectedDate = tasks.filter(task => task.dueDate === selectedDate);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Calendar Management</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarSelect}
              className="rounded-md border w-full pointer-events-auto"
              modifiers={{
                hasItems: (date) => dateHasItems(date),
              }}
              modifiersStyles={{
                hasItems: { 
                  fontWeight: 'bold', 
                  textDecoration: 'underline',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }
              }}
            />
            
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-sm mb-1">Legend</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-100 text-purple-800">Interview</Badge>
                <Badge className="bg-blue-100 text-blue-800">Meeting</Badge>
                <Badge className="bg-red-100 text-red-800">Deadline</Badge>
                <Badge className="bg-green-100 text-green-800">Task</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">Click on any date to add an event or task directly</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>
                {format(new Date(selectedDate), "MMMM d, yyyy")}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setIsAddingEvent(true);
                    setIsAddingTask(false);
                  }}
                  size="sm"
                  className="bg-brand-blue hover:bg-brand-darkBlue"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Event
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingTask(true);
                    setIsAddingEvent(false);
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="schedule">
              <TabsList className="mb-4">
                <TabsTrigger value="schedule">Events</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="all">All Items</TabsTrigger>
              </TabsList>
              
              {isAddingEvent && (
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !newEventDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newEventDate ? format(newEventDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newEventDate}
                                onSelect={setNewEventDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
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
                        <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
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
              
              {isAddingTask && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          placeholder="Task title"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !newTaskDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newTaskDate ? format(newTaskDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newTaskDate}
                                onSelect={setNewTaskDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex-1">
                          <select
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-brand-blue hover:bg-brand-darkBlue" onClick={addTask}>
                          Add Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <TabsContent value="schedule">
                <div className="space-y-3">
                  {eventsForSelectedDate.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No events scheduled for this date</div>
                  )}
                  
                  {eventsForSelectedDate.map((event) => (
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
              </TabsContent>
              
              <TabsContent value="tasks">
                <div className="space-y-3">
                  {tasksForSelectedDate.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No tasks for this date</div>
                  )}
                  
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 border rounded-md ${
                        task.status === "completed" ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <div className={`font-medium ${
                          task.status === "completed" ? "line-through text-gray-500" : ""
                        }`}>
                          {task.title}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(task.priority)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTaskStatus(task.id)}
                        >
                          {task.status === "completed" ? "Undo" : "Complete"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="all">
                <div className="space-y-3">
                  {eventsForSelectedDate.length === 0 && tasksForSelectedDate.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No events or tasks for this date</div>
                  )}
                  
                  {eventsForSelectedDate.map((event) => (
                    <div
                      key={`event-${event.id}`}
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
                  
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={`task-${task.id}`}
                      className={`flex items-center justify-between p-3 border rounded-md ${
                        task.status === "completed" ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex-1">
                        <div className={`font-medium ${
                          task.status === "completed" ? "line-through text-gray-500" : ""
                        }`}>
                          {task.title} <Badge variant="outline">Task</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(task.priority)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTaskStatus(task.id)}
                        >
                          {task.status === "completed" ? "Undo" : "Complete"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog for adding event/task directly from calendar */}
      <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Add to {selectedCalendarDate ? format(selectedCalendarDate, "MMMM d, yyyy") : "Calendar"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant={addType === "event" ? "default" : "outline"} 
              onClick={() => setAddType("event")}
              className={addType === "event" ? "bg-brand-blue hover:bg-brand-darkBlue" : ""}
            >
              Event
            </Button>
            <Button 
              variant={addType === "task" ? "default" : "outline"} 
              onClick={() => setAddType("task")}
              className={addType === "task" ? "bg-brand-blue hover:bg-brand-darkBlue" : ""}
            >
              Task
            </Button>
          </div>
          
          {addType === "event" ? (
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Event title"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
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
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Task title"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as "low" | "medium" | "high")}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCalendarDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFromCalendar} className="bg-brand-blue hover:bg-brand-darkBlue">
              Add {addType === "event" ? "Event" : "Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
