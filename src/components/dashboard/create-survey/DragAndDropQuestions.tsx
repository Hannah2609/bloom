"use client";

import React, { useState } from "react";
import { Question } from "@/types/survey";
import { QuestionCard } from "@/components/dashboard/cards/QuestionCard";
import { toast } from "sonner";

type DragAndDropQuestionsProps = {
  questions: Question[];
  surveyId: string;
  onReorder: (reorderedQuestions: Question[]) => void;
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
  editingQuestionId?: string | null;
  deletingQuestionId?: string | null;
  onError?: () => void;
  isDraft?: boolean;
};

export function DragAndDropQuestions({
  questions,
  surveyId,
  onReorder,
  onEdit,
  onDelete,
  editingQuestionId,
  deletingQuestionId,
  onError,
  isDraft = true,
}: DragAndDropQuestionsProps) {
  const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(
    null
  );
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedQuestionId(questionId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", questionId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedQuestionId) return;

    const draggedIndex = questions.findIndex((q) => q.id === draggedQuestionId);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedQuestionId(null);
      return;
    }

    // Create new order array
    const newQuestions = [...questions];
    const [draggedQuestion] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(dropIndex, 0, draggedQuestion);

    // Update order values: 1, 2, 3, 4...
    const reorderedQuestions = newQuestions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));

    // Prepare data for API
    const questionOrders = reorderedQuestions.map((q, index) => ({
      questionId: q.id,
      order: index + 1,
    }));

    // Optimistic update
    onReorder(reorderedQuestions);

    try {
      const response = await fetch(
        `/api/dashboard/surveys/${surveyId}/questions/reorder`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionOrders }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reorder questions");
      }

      toast.success("Questions reordered");
    } catch (error) {
      console.error("Error reordering questions:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reorder questions"
      );
      // Trigger error callback to revert
      onError?.();
      setDraggedQuestionId(null);
      return;
    }

    setDraggedQuestionId(null);
  };

  const handleDragEnd = () => {
    setDraggedQuestionId(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-2">
      {questions
        .filter((q) => q.id !== editingQuestionId)
        .map((question, index) => {
          const isDragging = draggedQuestionId === question.id;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={question.id}
              draggable={isDraft}
              onDragStart={
                isDraft ? (e) => handleDragStart(e, question.id) : undefined
              }
              onDragOver={isDraft ? (e) => handleDragOver(e, index) : undefined}
              onDragLeave={isDraft ? handleDragLeave : undefined}
              onDrop={isDraft ? (e) => handleDrop(e, index) : undefined}
              onDragEnd={isDraft ? handleDragEnd : undefined}
              className={isDragOver ? "opacity-50" : ""}
            >
              <QuestionCard
                question={question}
                onEdit={onEdit}
                onDelete={onDelete}
                isDragging={isDragging}
                isDeleting={deletingQuestionId === question.id}
                isDraft={isDraft}
              />
            </div>
          );
        })}
    </div>
  );
}
