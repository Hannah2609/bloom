"use client";

import React from "react";
import { Question } from "@/types/survey";
import { RatingScale } from "../survey/RatingScale";
import { Button } from "@/components/ui/button/button";
import { Pencil, GripVertical } from "lucide-react";

type EditQuestionCardProps = {
  question: Question;
  onEdit?: (question: Question) => void;
  isDragging?: boolean;
};

export function EditQuestionCard({
  question,
  onEdit,
  isDragging = false,
}: EditQuestionCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        isDragging ? "opacity-50 bg-accent border-primary" : "hover:bg-accent"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <div
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors flex items-center"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-5" />
          </div>
          <span className="font-medium text-muted-foreground">
            {question.order}.
          </span>
          <div className="flex-1">
            <p className="font-medium">{question.title}</p>
            {question.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {question.description}
              </p>
            )}
            {question.required && (
              <span className="text-xs text-muted-foreground">* Required</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RatingScale
            answerType={question.answerType || "SCALE"}
            disabled={true}
          />
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(question)}
              className="shrink-0"
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
