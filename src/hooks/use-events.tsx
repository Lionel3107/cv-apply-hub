
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  date: string;
  endDate?: string;
  isAllDay: boolean;
  status: string;
  relatedJobId?: string;
  relatedApplicationId?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!profile?.id) return;
      
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("events")
          .select(`
            id,
            title,
            description,
            type,
            date,
            end_date,
            is_all_day,
            status,
            related_job_id,
            related_application_id
          `)
          .eq("user_id", profile.id)
          .order("date", { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        // Transform the data
        const transformedEvents = data?.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          type: event.type,
          date: event.date,
          endDate: event.end_date,
          isAllDay: event.is_all_day,
          status: event.status,
          relatedJobId: event.related_job_id,
          relatedApplicationId: event.related_application_id,
        })) || [];

        setEvents(transformedEvents);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError(err.message);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          // Refetch events when we receive a real-time update
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  return { events, isLoading, error };
};
