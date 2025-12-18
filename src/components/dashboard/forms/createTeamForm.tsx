"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/forms/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CreateTeamSchema,
  createTeamSchema,
} from "@/lib/validation/validation";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import UserSearch, { User } from "./UserSearch";

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

export default function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async (data: CreateTeamSchema) => {
    try {
      setIsSubmitting(true);
      toast.loading("Creating team...");

      // Create team
      const response = await fetch("/api/dashboard/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create team");
      }

      const teamId = result.team.id;

      // Add members if any
      if (selectedUsers.length > 0) {
        const membersResponse = await fetch(
          `/api/dashboard/teams/${teamId}/members`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userIds: selectedUsers.map((u) => u.id),
            }),
          }
        );

        if (!membersResponse.ok) {
          const error = await membersResponse.json();
          toast.warning(
            `Team created but failed to add members: ${error.error}`
          );
        }
      }

      toast.dismiss();
      toast.success(
        `Team created${selectedUsers.length > 0 ? ` with ${selectedUsers.length} member(s)` : ""}!`,
        { duration: 3000 }
      );

      form.reset();
      setSelectedUsers([]);

      // Close sheet and refresh teams list if callback provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to create team",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <UserSearch
          selectedUsers={selectedUsers}
          onUsersChange={setSelectedUsers}
          label="Add Members (Optional)"
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Team"}
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </Form>
  );
}
