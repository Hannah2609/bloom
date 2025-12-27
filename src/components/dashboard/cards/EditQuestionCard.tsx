import React from "react";
import { Question } from "@/types/survey";
import { RatingScale } from "../survey/RatingScale";

type EditQuestionCardProps = {
  question: Question;
};

export function EditQuestionCard({ question }: EditQuestionCardProps) {
  return (
    <div
      key={question.id}
      className="border rounded-lg p-4 hover:bg-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 flex-1">
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
        <RatingScale
          answerType={question.answerType || "SCALE"}
          disabled={true}
        />
      </div>
    </div>
  );
}
