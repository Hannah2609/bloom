"use client";

import React from "react";
import { Question } from "@/types/survey";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { Pencil, GripVertical, Trash } from "lucide-react";

type EditQuestionCardProps = {
  question: Question;
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
  isDragging?: boolean;
  isDeleting?: boolean;
  isDraft?: boolean;
};

const ANSWER_TYPE_OPTIONS = [
  {
    value: "SATISFACTION" as const,
    label: "Satisfaction",
    description: "Not satisfied → Very satisfied",
  },
  {
    value: "AGREEMENT" as const,
    label: "Agreement",
    description: "Disagree → Agree",
  },
  {
    value: "SCALE" as const,
    label: "Scale 1-5",
    description: "Numeric scale from 1 to 5",
  },
];

export function QuestionCard({
  question,
  onEdit,
  onDelete,
  isDragging = false,
  isDeleting = false,
  isDraft = true,
}: EditQuestionCardProps) {
  const answerTypeOption = ANSWER_TYPE_OPTIONS.find(
    (opt) => opt.value === (question.answerType || "SCALE")
  );

  return (
    <div
      className={`group border rounded-lg p-4 transition-all ${
        isDragging ? "opacity-50 bg-accent border-primary" : ""
      } ${isDraft ? "hover:bg-accent/50 hover:shadow-sm" : ""}`}
    >
      <div className="flex items-start gap-4">
        {isDraft && (
          <div
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors flex items-center pt-0.5 "
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-5" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-2 mb-1">
                <div className="flex items-end gap-2">
                  <span className="font-medium text-muted-foreground">
                    {question.order}.
                  </span>
                  <p className="font-medium text-foreground">
                    {question.title}
                  </p>
                </div>
                {question.required && (
                  <Badge className="text-xs h-4 px-1.5 border-destructive/50 text-destructive bg-destructive/10 mb-4 md:mb-1">
                    Required
                  </Badge>
                )}
              </div>
              {question.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {question.description}
                </p>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(question)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="size-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(question)}
                    disabled={isDeleting}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {answerTypeOption && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Badge className="text-xs bg-muted">
                {answerTypeOption.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {answerTypeOption.description}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
