"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editProfileNameSchema } from "@/lib/validation/validation";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/forms/form";
import { toast } from "sonner";
import { Heading } from "@/components/ui/heading/heading";

interface ProfileNameFormProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function ProfileNameForm({
  userId,
  firstName,
  lastName,
  email,
}: ProfileNameFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof editProfileNameSchema>>({
    resolver: zodResolver(editProfileNameSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  });

  // Sync form when props change
  useEffect(() => {
    form.reset({ firstName, lastName });
  }, [firstName, lastName, form]);

  const onSubmit = async (formData: z.infer<typeof editProfileNameSchema>) => {
    if (formData.firstName === firstName && formData.lastName === lastName) {
      toast.info("No changes to save");
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Heading level="h2" className="font-medium text-2xl">
          Edit Profile
        </Heading>
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
          <Input type="email" value={email} disabled className="opacity-60" />
          <p className="text-muted-foreground text-xs">
            Email cannot be changed
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
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
            <Button
              type="button"
              variant="outline"
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
  );
}
