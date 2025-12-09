import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/forms/form";
import { Heading } from "@/components/ui/heading/heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CreateTeamSchema,
  createTeamSchema,
} from "@/lib/validation/validation";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";

export default function CreateTeamForm() {
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: CreateTeamSchema) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Heading level="h3" variant="muted" className="text-lg! font-normal!">
            Create Team
          </Heading>
        </div>
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
        <Button type="submit">Create Team</Button>
      </form>
    </Form>
  );
}
