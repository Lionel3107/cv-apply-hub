
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Applicant } from "@/types/applicant";
import { useMessages, Message } from "@/hooks/use-messages";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
}

export const MessageDialog = ({
  open,
  onOpenChange,
  applicant,
}: MessageDialogProps) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useMessages(applicant?.id);
  const [isSending, setIsSending] = useState(false);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Reset new message when dialog closes
  useEffect(() => {
    if (!open) {
      setNewMessage("");
    }
  }, [open]);

  if (!applicant) return null;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !applicant) return;
    
    setIsSending(true);
    try {
      // We assume the applicant's user_id is stored or can be retrieved
      const recipientId = applicant.userId || ""; // You may need to adjust this based on your applicant data structure
      await sendMessage(recipientId, newMessage, applicant.id);
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[75vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Messages with {applicant.name}</DialogTitle>
          <DialogDescription>
            For application to {applicant.jobTitle}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          </div>
        ) : (
          <ScrollArea className="flex-grow p-4 border rounded-md my-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No messages yet. Start the conversation by sending a message below.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message} 
                    isFromCurrentUser={message.senderId === user?.id}
                    formatMessageTime={formatMessageTime}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        )}

        <div className="mt-auto">
          <Separator className="my-4" />
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="self-end"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to send</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface MessageBubbleProps {
  message: Message;
  isFromCurrentUser: boolean;
  formatMessageTime: (dateString: string) => string;
}

const MessageBubble = ({ message, isFromCurrentUser, formatMessageTime }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          max-w-[75%] rounded-lg p-3 
          ${isFromCurrentUser 
            ? 'bg-brand-blue text-white' 
            : 'bg-gray-100 text-gray-800'}
        `}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};
