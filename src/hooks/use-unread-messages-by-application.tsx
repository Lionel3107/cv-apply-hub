
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUnreadMessagesByApplication = () => {
  const [unreadCountsByApplication, setUnreadCountsByApplication] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUnreadCounts = async () => {
      try {
        // Get all unread messages where this user is the recipient, grouped by application
        const { data, error } = await supabase
          .from("messages")
          .select("related_application_id")
          .eq("recipient_id", user.id)
          .eq("is_read", false)
          .not("related_application_id", "is", null);

        if (error) throw error;

        // Count messages by application
        const counts: Record<string, number> = {};
        data?.forEach((message) => {
          if (message.related_application_id) {
            counts[message.related_application_id] = (counts[message.related_application_id] || 0) + 1;
          }
        });

        setUnreadCountsByApplication(counts);
      } catch (error) {
        console.error("Error fetching unread message counts by application:", error);
      }
    };

    fetchUnreadCounts();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("unread-messages-by-application")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return unreadCountsByApplication;
};
