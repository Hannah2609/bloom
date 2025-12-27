import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/forms/form";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { Switch } from "@/components/ui/switch/switch";
import { ArrowRight, Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createSurveySchema } from "@/lib/validation/validation";
import { z } from "zod";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import TeamSearch, { Team } from "./TeamSearch";
import { useRouter } from "next/navigation";

type CreateSurveyFormProps = {
  onSuccess?: () => void; // Callback to refresh surveys list after creation
};

type CreateSurveyFormData = z.infer<typeof createSurveySchema>;

export default function CreateSurveyForm({ onSuccess }: CreateSurveyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const router = useRouter();

  const form = useForm<CreateSurveyFormData>({
    resolver: zodResolver(createSurveySchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      isGlobal: false,
      teamIds: [],
    },
  });

  const submit = async (data: CreateSurveyFormData) => {
    try {
      setIsSubmitting(true);
      toast.loading("Creating survey...");

      // Create survey
      const response = await fetch("/api/dashboard/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create survey");
      }

      toast.dismiss();
      toast.success(`Survey created! Redirecting...`, { duration: 2000 });

      form.reset();
      setSelectedTeams([]);

      // Refresh surveys list
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to survey detail page to add questions
      router.push(`/create-surveys/${result.survey.id}`);
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to create survey",
        {
          duration: 4000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="w-full space-y-6 py-8"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Survey Title*</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* isGlobal Toggle */}
          <FormField
            control={form.control}
            name="isGlobal"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Send to entire company</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Make this survey available to all employees
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        setSelectedTeams([]);
                        form.setValue("teamIds", []);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Team Selection - Only show when not global */}
          {!form.watch("isGlobal") && (
            <div>
              <TeamSearch
                selectedTeams={selectedTeams}
                onTeamsChange={(teams) => {
                  setSelectedTeams(teams);
                  form.setValue(
                    "teamIds",
                    teams.map((t) => t.id)
                  );
                }}
                label="Select Teams"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Date
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="inline-block size-4 ml-1 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You can always set dates later</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4">
            <Button variant="outline" type="submit" className="w-full mb-4">
              Add survey questions
              <ArrowRight className="size-4" />
            </Button>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Creating..."
                : "Create survey, add questions later"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
