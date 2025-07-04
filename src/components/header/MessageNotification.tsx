
import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MessageNotificationProps {
  unreadCount: number;
}

export const MessageNotification = ({ unreadCount }: MessageNotificationProps) => {
  return (
    <Link to="/dashboard">
      <Button variant="ghost" size="icon" className="relative">
        <Mail className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
};
