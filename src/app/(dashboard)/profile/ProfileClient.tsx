"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/ui/layout/dashboard/pageLayout/pageLayout";
import { UserWithCompany } from "@/types/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { Edit, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileClientProps {
  user: UserWithCompany;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
  });

  const { startUpload } = useUploadThing("imageUploader");
  const { logout } = useAuth();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      const uploaded = await startUpload([file]);

      if (!uploaded || uploaded.length === 0 || !uploaded[0]?.url) {
        throw new Error("Avatar upload failed");
      }

      const avatarUrl = uploaded[0].url;

      // TODO: Add API call when route is ready
      // const response = await fetch("/api/dashboard/profile", {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ avatar: avatarUrl }),
      // });

      setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload avatar. Please try again."
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: Add API call when route is ready
      // const response = await fetch("/api/dashboard/profile", {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     email: formData.email,
      //   }),
      // });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <Heading level="h1">Profile</Heading>
        <p className="text-muted-foreground mt-1">
          Edit your profile information
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-8 gap-6">
        {/* Avatar Section */}
        <div className="bg-sidebar col-span-full md:col-span-3 lg:col-span-2 rounded-md p-8">
          <div className="grid place-items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                {formData.avatar ? (
                  <AvatarImage src={formData.avatar} alt={formData.firstName} />
                ) : (
                  <AvatarFallback className="[&>svg]:size-18!" />
                )}
              </Avatar>

              {/* Upload Overlay */}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 grid place-items-center bg-black/60 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : (
                  <Edit className="h-8 w-8 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={isUploadingAvatar}
              />
            </div>

            <div className="text-center space-y-2">
              <Heading level="h2">
                {formData.firstName} {formData.lastName}
              </Heading>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {user.company.name}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <Button onClick={logout} className="w-full mt-6">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile Form */}
        <div className="col-span-full md:col-span-5 lg:col-span-6 bg-sidebar rounded-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
              />
            </div>

            <div className="flex gap-2 pt-4">
              {isEditing ? (
                <>
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        avatar: user.avatar,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
