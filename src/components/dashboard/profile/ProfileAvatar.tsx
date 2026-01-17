"use client";

import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Edit, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileAvatarProps {
  avatar?: string | null;
  firstName: string;
  userId: string;
}

export function ProfileAvatar({
  avatar,
  firstName,
  userId,
}: ProfileAvatarProps) {
  const router = useRouter();
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading avatar...");
      const uploaded = await startUpload([file]);

      if (!uploaded?.[0]?.url) throw new Error("Upload failed");

      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: uploaded[0].url }),
      });

      if (!response.ok) throw new Error("Failed to update avatar");

      toast.dismiss();
      toast.success("Avatar updated!");
      window.dispatchEvent(new Event("session-change"));
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-32 w-32">
        {avatar ? (
          <div className="relative h-full w-full">
            <Image
              src={avatar}
              alt={firstName}
              fill
              className="rounded-full object-cover"
              priority
              sizes="128px"
            />
          </div>
        ) : (
          <AvatarFallback className="[&>svg]:size-18!" />
        )}
      </Avatar>

      <label
        htmlFor="avatar-upload"
        className="absolute inset-0 grid cursor-pointer place-items-center rounded-full bg-black/60 opacity-0 transition-opacity hover:opacity-100"
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        ) : (
          <Edit className="h-8 w-8 text-white" />
        )}
      </label>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
        disabled={isUploading}
      />
    </div>
  );
}
