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

interface CreateTeamFormProps {
  onSuccess?: () => void;
}

export default function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const response = await fetch("/api/dashboard/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create team");
      }

      toast.dismiss();
      toast.success("Team created successfully!", {
        duration: 3000,
      });

      form.reset();

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

        {/* Add people - picker/selctor/search? */}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Team"}
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </Form>
  );
}
