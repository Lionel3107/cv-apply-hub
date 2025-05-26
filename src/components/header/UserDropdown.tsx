
import React from "react";
import { Link } from "react-router-dom";
import { Building, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_employer: boolean;
}

interface User {
  email?: string;
}

interface UserDropdownProps {
  user: User;
  profile: Profile | null;
  unreadCount: number;
  onSignOut: () => void;
}

export const UserDropdown = ({ user, profile, unreadCount, onSignOut }: UserDropdownProps) => {
  const getProfileInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-1 h-auto rounded-full">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback>{getProfileInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <p className="text-sm font-medium">
            {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : user.email}
          </p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        {profile?.is_employer ? (
          <Link to="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <Building className="mr-2 h-4 w-4" />
              <span>Company Dashboard</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {unreadCount}
                </Badge>
              )}
            </DropdownMenuItem>
          </Link>
        ) : (
          <Link to="/applicant-dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
