"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/forms/radio-group";
import { Switch } from "@/components/ui/switch/switch";
import { toast } from "sonner";

type AnswerType = "SATISFACTION" | "AGREEMENT" | "SCALE";

type AddQuestionFormProps = {
  surveyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ANSWER_TYPE_OPTIONS = [
  {
    value: "SATISFACTION" as AnswerType,
    label: "Satisfaction",
    description: "Not sasti → Meget tilfreds",
  },
  {
    value: "AGREEMENT" as AnswerType,
    label: "Agreement",
    description: "Disagree → Agree",
  },
  {
    value: "SCALE" as AnswerType,
    label: "Scale 1-5",
    description: "Numeric scale from 1 to 5",
  },
];

export function AddQuestionForm({
  surveyId,
  onSuccess,
  onCancel,
}: AddQuestionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    answerType: "SCALE" as AnswerType,
    required: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/dashboard/surveys/${surveyId}/questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create question");
      }

      toast.success("Question created");

      // Reset form
      setFormData({
        title: "",
        description: "",
        answerType: "SCALE",
        required: true,
      });

      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not create question"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          Question <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="E.g. How satisfied are you with your work environment?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          type="textarea"
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add extra context or explanation..."
        />
      </div>

      <div className="space-y-3">
        <Label>
          Answer Type <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.answerType}
          onValueChange={(value) =>
            setFormData({ ...formData, answerType: value as AnswerType })
          }
        >
          {ANSWER_TYPE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <div className="flex-1">
                <Label
                  htmlFor={option.value}
                  className="font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="required" className="cursor-pointer">
            Required Question
          </Label>
          <p className="text-sm text-muted-foreground">
            Users must answer this question
          </p>
        </div>
        <Switch
          id="required"
          checked={formData.required}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, required: checked })
          }
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Question"}
        </Button>
      </div>
    </form>
  );
}
