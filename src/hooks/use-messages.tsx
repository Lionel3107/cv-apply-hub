
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  subject?: string;
  senderId: string;
  recipientId: string;
  relatedApplicationId?: string;
  isRead: boolean;
  createdAt: string;
  senderName?: string; // Added for display purposes
}

export const useMessages = (applicationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from("messages")
          .select(`
            id,
            content,
            subject,
            sender_id,
            recipient_id,
            related_application_id,
            is_read,
            created_at
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

        if (applicationId) {
          query = query.eq("related_application_id", applicationId);
        }

        const { data, error: fetchError } = await query.order("created_at", { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        // Transform the data
        const transformedMessages = data?.map((message) => ({
          id: message.id,
          content: message.content,
          subject: message.subject || undefined,
          senderId: message.sender_id,
          recipientId: message.recipient_id,
          relatedApplicationId: message.related_application_id || undefined,
          isRead: message.is_read,
          createdAt: message.created_at
        })) || [];

        setMessages(transformedMessages);
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        setError(err.message);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: applicationId 
            ? `related_application_id=eq.${applicationId}` 
            : `sender_id=eq.${user.id}:recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log("Realtime message update:", payload);
          fetchMessages(); // Refetch all messages when we receive an update
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, applicationId]);

  // Function to send a new message
  const sendMessage = async (
    recipientId: string,
    content: string,
    applicationId?: string,
    subject?: string
  ) => {
    if (!user?.id) {
      toast.error("You must be logged in to send messages");
      return null;
    }

    try {
      const { data, error } = await supabase.from("messages").insert({
        sender_id: user.id,
        recipient_id: recipientId,
        content,
        subject,
        related_application_id: applicationId,
        is_read: false
      }).select();

      if (error) throw error;

      toast.success("Message sent successfully");
      return data?.[0] || null;
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
      return null;
    }
  };

  // Function to mark a message as read
  const markAsRead = async (messageId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId)
        .eq("recipient_id", user.id);

      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      
      return true;
    } catch (err: any) {
      console.error("Error marking message as read:", err);
      return false;
    }
  };

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    markAsRead 
  };
};
