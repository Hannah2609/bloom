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
import { Info } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import TeamSearch, { Team } from "./TeamSearch";
import { useRouter } from "next/navigation";
import {
  editSurveySchema,
  type EditSurveySchema,
} from "@/lib/validation/validation";

type EditSurveyFormProps = {
  survey: {
    id: string;
    title: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    isGlobal: boolean;
    teams: { team: { id: string; name: string } }[];
  };
  onSuccess?: () => void;
};

export function EditSurveyForm({ survey, onSuccess }: EditSurveyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>(
    survey.teams.map((t) => ({ id: t.team.id, name: t.team.name }))
  );
  const router = useRouter();

  const form = useForm<EditSurveySchema>({
    resolver: zodResolver(editSurveySchema),
    defaultValues: {
      title: survey.title,
      description: survey.description || "",
      startDate: survey.startDate
        ? new Date(survey.startDate).toISOString().split("T")[0]
        : "",
      endDate: survey.endDate
        ? new Date(survey.endDate).toISOString().split("T")[0]
        : "",
      isGlobal: survey.isGlobal,
      teamIds: survey.teams.map((t) => t.team.id),
    },
  });

  const submit = async (data: EditSurveySchema) => {
    try {
      setIsSubmitting(true);
      toast.loading("Updating survey...");

      // Update survey
      const response = await fetch(`/api/dashboard/surveys/${survey.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update survey");
      }

      toast.dismiss();
      toast.success("Survey updated successfully!", { duration: 2000 });

      // Call success callback to close dialog and refresh
      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to update survey",
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
          className="w-full space-y-6 py-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Survey Title<span className="text-destructive">*</span>
                </FormLabel>
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
              <FormItem className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FormLabel className="text-base font-medium">
                    Global survey
                  </FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="inline-block size-4 ml-1 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Make this survey available to all employees</p>
                    </TooltipContent>
                  </Tooltip>
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

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">
                  Survey status changes automatically based on dates:
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                  <li>
                    Start date in the future → Survey becomes{" "}
                    <strong>DRAFT</strong>
                  </li>
                  <li>
                    Start date reached → Survey becomes <strong>ACTIVE</strong>
                  </li>
                  <li>
                    End date reached → Survey becomes <strong>CLOSED</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update survey"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
