"use client";

import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge/badge";
import { SurveyDetail, Question } from "@/types/survey";
import { useState } from "react";
import { AddQuestionForm } from "@/components/dashboard/survey/AddQuestionForm";
import { DragAndDropQuestions } from "@/components/dashboard/survey/DragAndDropQuestions";

interface SurveyClientProps {
  survey: SurveyDetail;
}

export default function SurveyClient({
  survey: initialSurvey,
}: SurveyClientProps) {
  const router = useRouter();
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>(
    [...initialSurvey.questions].sort((a, b) => a.order - b.order)
  );
  const [questionCount, setQuestionCount] = useState(
    initialSurvey.questionCount
  );

  const handleQuestionSuccess = (
    savedQuestion: Question & {
      createdAt: Date;
      updatedAt: Date | null;
    }
  ) => {
    if (editingQuestionId) {
      // Update existing question optimistically
      const updatedQuestions = questions.map((q) =>
        q.id === savedQuestion.id
          ? {
              ...savedQuestion,
              createdAt: new Date(savedQuestion.createdAt),
              updatedAt: savedQuestion.updatedAt
                ? new Date(savedQuestion.updatedAt)
                : null,
            }
          : q
      );
      // Sort by order to maintain correct sequence
      setQuestions(updatedQuestions.sort((a, b) => a.order - b.order));
      setEditingQuestionId(null);
    } else {
      // Add new question optimistically
      const newQuestion: Question = {
        ...savedQuestion,
        createdAt: new Date(savedQuestion.createdAt),
        updatedAt: savedQuestion.updatedAt
          ? new Date(savedQuestion.updatedAt)
          : null,
      };
      const updatedQuestions = [...questions, newQuestion];
      // Sort by order to maintain correct sequence
      setQuestions(updatedQuestions.sort((a, b) => a.order - b.order));
      setQuestionCount(questionCount + 1);
      setShowAddQuestionForm(false);
    }
    // Refresh in background to ensure consistency (non-blocking)
    setTimeout(() => router.refresh(), 100);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.id);
    setShowAddQuestionForm(false);
  };

  const handleCancel = () => {
    setShowAddQuestionForm(false);
    setEditingQuestionId(null);
  };

  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);

  const handleReorder = (reorderedQuestions: Question[]) => {
    // Store original order for potential rollback
    setOriginalQuestions([...questions]);
    // Optimistic update
    setQuestions(reorderedQuestions);
    // Refresh in background to ensure consistency
    setTimeout(() => router.refresh(), 100);
  };

  const handleReorderError = () => {
    // Revert to original order on error
    if (originalQuestions.length > 0) {
      setQuestions(originalQuestions);
      setOriginalQuestions([]);
    } else {
      // Fallback: reload from server
      router.refresh();
    }
  };

  const editingQuestion = editingQuestionId
    ? questions.find((q) => q.id === editingQuestionId)
    : null;

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/create-surveys")}
            >
              <ArrowLeft className="size-4" />
              Back to Surveys
            </Button>
          </div>
        </div>

        {/* Survey Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Heading level={"h1"}>{initialSurvey.title}</Heading>
            {initialSurvey.isGlobal ? (
              <Badge>Global Survey</Badge>
            ) : (
              <Badge>{initialSurvey.teams.length} Team(s)</Badge>
            )}
          </div>

          {initialSurvey.description && (
            <p className="text-muted-foreground">{initialSurvey.description}</p>
          )}

          <div className="flex gap-4 text-sm text-muted-foreground">
            {initialSurvey.startDate && (
              <span>
                Start: {new Date(initialSurvey.startDate).toLocaleDateString()}
              </span>
            )}
            {initialSurvey.endDate && (
              <span>
                End: {new Date(initialSurvey.endDate).toLocaleDateString()}
              </span>
            )}
            <span>{initialSurvey.responseCount} Responses</span>
          </div>

          {!initialSurvey.isGlobal && initialSurvey.teams.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium">Teams:</span>
              {initialSurvey.teams.map(({ team }) => (
                <Badge key={team.id}>{team.name}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading level={"h2"}>Questions ({questionCount})</Heading>
            {!showAddQuestionForm && !editingQuestionId && (
              <Button onClick={() => setShowAddQuestionForm(true)}>
                <Plus className="size-4" />
                Add Question
              </Button>
            )}
          </div>

          {(showAddQuestionForm || editingQuestion) && (
            <AddQuestionForm
              surveyId={initialSurvey.id}
              question={editingQuestion || undefined}
              onSuccess={handleQuestionSuccess}
              onCancel={handleCancel}
            />
          )}

          {questions.length === 0 &&
          !showAddQuestionForm &&
          !editingQuestionId ? (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                No questions yet. Add your first question to get started!
              </p>
            </div>
          ) : (
            <DragAndDropQuestions
              questions={questions}
              surveyId={initialSurvey.id}
              onReorder={handleReorder}
              onEdit={handleEditQuestion}
              editingQuestionId={editingQuestionId}
              onError={handleReorderError}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
