"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { UserWithCompany } from "@/types/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { Edit, Loader2, LogOut } from "lucide-react";
import { editProfileNameSchema } from "@/lib/validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/forms/form";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

interface ProfileClientProps {
  user: UserWithCompany;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof editProfileNameSchema>>({
    resolver: zodResolver(editProfileNameSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  // Sync form when user data changes
  useEffect(() => {
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }, [user.firstName, user.lastName, form]);

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading avatar...");
      const uploaded = await startUpload([file]);

      if (!uploaded?.[0]?.url) throw new Error("Upload failed");

      const response = await fetch(`/api/dashboard/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: uploaded[0].url }),
      });

      if (!response.ok) throw new Error("Failed to update avatar");

      toast.dismiss();
      toast.success("Avatar updated!");
      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
    }
  };

  // Form submit handler
  const onSubmit = async (formData: z.infer<typeof editProfileNameSchema>) => {
    if (
      formData.firstName === user.firstName &&
      formData.lastName === user.lastName
    ) {
      toast.info("No changes to save");
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/dashboard/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-8">
        <Heading level="h1">Profile</Heading>
        <p className="text-muted-foreground text-lg md:text-xl mt-1">
          Edit your profile information
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-10">
        {/* Sidebar - Avatar & User Info */}
        <div className="bg-sidebar h-full col-span-full rounded-md p-8 lg:col-span-4 xl:col-span-3">
          <div className="grid place-items-center gap-4">
            {/* Avatar with upload */}
            <div className="relative">
              <Avatar className="h-32 w-32">
                {user.avatar ? (
                  <div className="relative h-full w-full">
                    {/* Image for better rendering performance */}
                    <Image
                      src={user.avatar}
                      alt={user.firstName}
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

            {/* User info */}
            <div className="space-y-2 text-center">
              <Heading level="h2">
                {user.firstName} {user.lastName}
              </Heading>
              <p className="text-muted-foreground text-sm">{user.role}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {user.company.name}
              </p>

              <Button onClick={logout} className="mt-6 min-w-48" type="button">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main - Profile Form */}
        <div className="bg-sidebar col-span-full rounded-md p-8 lg:col-span-6 xl:col-span-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          autoComplete="given-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          autoComplete="family-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email - read only */}
              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="opacity-60"
                />
                <p className="text-muted-foreground text-xs">
                  Email cannot be changed
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          Saving changes...
                          <Loader2 className="size-4 animate-spin" />
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </section>
    </PageLayout>
  );
}
