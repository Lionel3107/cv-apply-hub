
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMessages, Message } from "@/hooks/use-messages";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface ConversationViewProps {
  conversationId: string;
  messages: Message[];
  onBack: () => void;
}

export const ConversationView = ({ conversationId, messages, onBack }: ConversationViewProps) => {
  const { user } = useAuth();
  const { sendMessage, markAsRead } = useMessages();
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    messages.forEach(message => {
      if (!message.isRead && message.recipientId === user?.id) {
        markAsRead(message.id);
      }
    });
  }, [messages, user?.id, markAsRead]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    setIsSending(true);
    try {
      // Find the recipient (the other person in the conversation)
      const otherMessage = messages.find(m => m.senderId !== user.id);
      if (otherMessage) {
        const applicationId = messages[0]?.relatedApplicationId;
        await sendMessage(otherMessage.senderId, newMessage, applicationId);
        setNewMessage("");
      }
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
    <Card className="h-[70vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Conversation</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No messages in this conversation yet.
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

        <div className="p-4 border-t">
          <Separator className="mb-4" />
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
      </CardContent>
    </Card>
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
        {message.subject && (
          <p className={`font-semibold mb-1 ${isFromCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
            {message.subject}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};
