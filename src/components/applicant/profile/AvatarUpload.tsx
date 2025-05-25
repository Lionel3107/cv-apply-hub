
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadProps {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  onAvatarUpdate: (url: string) => void;
}

export const AvatarUpload = ({ avatarUrl, firstName, lastName, onAvatarUpdate }: AvatarUploadProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;

    const file = e.target.files[0];
    
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar file is too large. Maximum size is 2MB.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Selected file is not an image.");
      return;
    }

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = publicURL.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      onAvatarUpdate(newAvatarUrl);
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl} alt="Profile picture" />
        <AvatarFallback className="text-3xl">
          {firstName.charAt(0) || lastName.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <label htmlFor="avatar-upload" className="cursor-pointer">
        <Button type="button" variant="outline" size="sm" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload Photo"}
        </Button>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
      </label>
      <p className="text-xs text-gray-500 text-center">
        Recommended: 400x400px (max 2MB)
      </p>
    </div>
  );
};
