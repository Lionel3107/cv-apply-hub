
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Calendar } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationView } from "./ConversationView";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

export const ApplicantDashboardMessages = () => {
  const { user } = useAuth();
  const { messages, isLoading, error, markAsRead } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Group messages by application or sender
  const conversations = messages.reduce((acc, message) => {
    const key = message.relatedApplicationId || message.senderId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  // Sort conversations by latest message
  const sortedConversations = Object.entries(conversations).sort(
    ([, a], [, b]) => new Date(b[b.length - 1].createdAt).getTime() - new Date(a[a.length - 1].createdAt).getTime()
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">Error loading messages: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedConversation) {
    return (
      <ConversationView
        conversationId={selectedConversation}
        messages={conversations[selectedConversation] || []}
        onBack={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedConversations.length > 0 ? (
          <div className="space-y-4">
            {sortedConversations.map(([conversationId, conversationMessages]) => {
              const latestMessage = conversationMessages[conversationMessages.length - 1];
              const unreadCount = conversationMessages.filter(m => !m.isRead).length;
              
              return (
                <div
                  key={conversationId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedConversation(conversationId);
                    // Mark unread messages as read when opening conversation
                    conversationMessages.forEach(message => {
                      if (!message.isRead && message.recipientId === user?.id) {
                        markAsRead(message.id);
                      }
                    });
                  }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-brand-blue flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          Company Representative
                        </p>
                        {unreadCount > 0 && (
                          <Badge variant="secondary" className="bg-brand-blue text-white">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {latestMessage.subject || latestMessage.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(latestMessage.createdAt), "MMM d, yyyy h:mm a")}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <MessageCircle className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-gray-500">
              Messages from companies about your applications will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
