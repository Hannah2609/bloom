"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/forms/radio-group";
import { Switch } from "@/components/ui/switch/switch";
import { toast } from "sonner";
import { Question } from "@/types/survey";

type AnswerType = "SATISFACTION" | "AGREEMENT" | "SCALE";

type AddQuestionFormProps = {
  surveyId: string;
  question?: Question;
  onSuccess?: (question: Question) => void;
  onCancel?: () => void;
};

const ANSWER_TYPE_OPTIONS = [
  {
    value: "SATISFACTION" as AnswerType,
    label: "Satisfaction",
    description: "Not satisfied → Very satisfied",
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
  question,
  onSuccess,
  onCancel,
}: AddQuestionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!question;
  const [formData, setFormData] = useState({
    title: question?.title || "",
    description: question?.description || "",
    answerType: (question?.answerType || "SCALE") as AnswerType,
    required: question?.required ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = `/api/dashboard/surveys/${surveyId}/questions`;
      const method = isEditMode ? "PUT" : "POST";
      const body = isEditMode
        ? { ...formData, questionId: question!.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message ||
            `Failed to ${isEditMode ? "update" : "create"} question`
        );
      }

      const result = await response.json();
      const savedQuestion = result.question;

      toast.success(`Question ${isEditMode ? "updated" : "created"}`);

      // Reset form only if creating new question
      if (!isEditMode) {
        setFormData({
          title: "",
          description: "",
          answerType: "SCALE",
          required: true,
        });
      }

      // Pass the saved question to onSuccess callback for optimistic update
      onSuccess?.(savedQuestion);
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} question:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Could not ${isEditMode ? "update" : "create"} question`
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
          placeholder="How satisfied are you with your work environment?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          type="textarea"
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add extra context or explanation"
        />
      </div>

      <div className="space-y-3">
        <Label>
          Answer Type <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          className="lg:grid lg:grid-cols-3"
          value={formData.answerType}
          onValueChange={(value) =>
            setFormData({ ...formData, answerType: value as AnswerType })
          }
        >
          {ANSWER_TYPE_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-accent bg-card transition-colors"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <div className="flex-1">
                <Label
                  htmlFor={option.value}
                  className="font-medium cursor-pointer"
                >
                  <div className="flex flex-col items-left">
                    {option.label}
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4 bg-card">
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
          {isLoading
            ? isEditMode
              ? "Saving..."
              : "Adding..."
            : isEditMode
              ? "Save question"
              : "Add question"}
        </Button>
      </div>
    </form>
  );
}
