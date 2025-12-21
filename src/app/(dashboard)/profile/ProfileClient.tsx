"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { UserWithCompany } from "@/types/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { Edit, Loader2, LogOut, XIcon } from "lucide-react";
import { editProfileSchema } from "@/lib/validation/validation";
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
  const [submitStep, setSubmitStep] = useState<
    "idle" | "uploading-avatar" | "updating-profile"
  >("idle");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { logout } = useAuth();
  const { startUpload, isUploading: isAvatarUploading } =
    useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || "",
    },
  });

  const handleAvatarUpload = async (file: File) => {
    setSubmitStep("uploading-avatar");

    try {
      const uploaded = await startUpload([file]);
      if (!uploaded || uploaded.length === 0 || !uploaded[0]?.url) {
        throw new Error("Avatar upload failed. Please try again.");
      }

      const avatarUrl = uploaded[0].url;

      // Update avatar immediately
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: avatarUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Avatar updated successfully!");
        form.setValue("avatar", avatarUrl);
        setAvatarFile(null);
      } else {
        toast.error(data.error || "Failed to update avatar");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
    } finally {
      setSubmitStep("idle");
    }
  };

  const onSubmit = async (formData: z.infer<typeof editProfileSchema>) => {
    setSubmitStep("updating-profile");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          posistion: formData.posistion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setSubmitStep("idle");
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section className="grid grid-cols-1 gap-6 md:grid-cols-10">
            {/* Avatar Section */}
            <div className="bg-sidebar max-h-96 col-span-full rounded-md p-8 lg:col-span-4 xl:col-span-3">
              <div className="grid place-items-center gap-4">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Avatar className="h-32 w-32">
                            {field.value ? (
                              <AvatarImage
                                src={field.value}
                                alt={form.watch("firstName")}
                              />
                            ) : (
                              <AvatarFallback className="[&>svg]:size-18!" />
                            )}
                          </Avatar>

                          {/* Upload Overlay - Always visible */}
                          <>
                            {avatarFile ? (
                              <div className="absolute inset-0 grid place-items-center rounded-full bg-black/60">
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-white hover:bg-white/20"
                                  onClick={() => {
                                    setAvatarFile(null);
                                  }}
                                >
                                  <XIcon className="h-8 w-8" />
                                </Button>
                              </div>
                            ) : (
                              <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 grid cursor-pointer place-items-center rounded-full bg-black/60 opacity-0 transition-opacity hover:opacity-100"
                              >
                                {submitStep === "uploading-avatar" ? (
                                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                                ) : (
                                  <Edit className="h-8 w-8 text-white" />
                                )}
                              </label>
                            )}
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleAvatarUpload(file);
                                }
                              }}
                              disabled={submitStep !== "idle"}
                            />
                          </>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2 text-center">
                  <Heading level="h2">
                    {form.watch("firstName")} {form.watch("lastName")}
                  </Heading>
                  <p className="text-muted-foreground text-sm">{user.role}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {user.company.name}
                  </p>

                  {/* Logout Button */}
                  <Button
                    onClick={logout}
                    className="mt-6 min-w-48"
                    type="button"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-sidebar col-span-full rounded-md p-8 lg:col-span-6 xl:col-span-7">
              <div className="space-y-6">
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

                <FormField
                  control={form.control}
                  name="posistion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          placeholder="e.g. Software Engineer"
                          autoComplete="organization-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="flex gap-2 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        type="submit"
                        disabled={
                          submitStep === "updating-profile" || isAvatarUploading
                        }
                      >
                        {submitStep === "updating-profile" ? (
                          <>
                            Saving changes...
                            <Loader2 className="size-4 animate-spin" />
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
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
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </form>
      </Form>
    </PageLayout>
  );
}
