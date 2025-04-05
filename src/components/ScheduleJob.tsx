
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface ScheduleJobProps {
  job: any;
  onClose: () => void;
}

export function ScheduleJob({ job, onClose }: ScheduleJobProps) {
  const { profile } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventType, setEventType] = useState("application_deadline");
  const [title, setTitle] = useState(`${eventType === "application_deadline" ? "Application Deadline" : "Interview"} for ${job.title}`);
  const [description, setDescription] = useState("");
  const [isAllDay, setIsAllDay] = useState(true);
  const [time, setTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeChange = (value: string) => {
    setEventType(value);
    setTitle(`${value === "application_deadline" ? "Application Deadline" : "Interview"} for ${job.title}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create event date object
      let eventDate = new Date(date);
      if (!isAllDay) {
        const [hours, minutes] = time.split(':').map(Number);
        eventDate.setHours(hours, minutes, 0, 0);
      }
      
      // Create end date if not all-day event
      let endDate = null;
      if (!isAllDay) {
        endDate = new Date(date);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        endDate.setHours(endHours, endMinutes, 0, 0);
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title,
          description,
          type: eventType,
          date: eventDate.toISOString(),
          end_date: endDate ? endDate.toISOString() : null,
          is_all_day: isAllDay,
          related_job_id: job.id,
          user_id: profile.id,
          status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      toast.success("Event scheduled successfully");
      onClose();
    } catch (error: any) {
      console.error("Error scheduling event:", error);
      toast.error(error.message || "Failed to schedule event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="event-type">Event Type</Label>
          <Select value={eventType} onValueChange={handleTypeChange}>
            <SelectTrigger id="event-type">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="application_deadline">Application Deadline</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="review">Candidate Review</SelectItem>
              <SelectItem value="custom">Custom Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-20"
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is-all-day"
            checked={isAllDay}
            onCheckedChange={setIsAllDay}
          />
          <Label htmlFor="is-all-day">All day event</Label>
        </div>
        
        {!isAllDay && (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Scheduling..." : "Schedule Event"}
        </Button>
      </div>
    </form>
  );
}
