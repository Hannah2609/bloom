"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SurveyDetail } from "@/types/survey";
import { Button } from "@/components/ui/button/button";
import { QuestionRenderer } from "@/components/dashboard/survey/questions/QuestionRenderer";
import { Card, CardContent, CardHeader } from "@/components/ui/card/card";
import { Heading } from "@/components/ui/heading/heading";
import { Progress } from "@/components/ui/progress/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog/alert-dialog";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";

interface TakeSurveyClientProps {
  survey: SurveyDetail;
}

type AnswersState = Record<string, number>;

export default function TakeSurveyClient({ survey }: TakeSurveyClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const questions = survey.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Check if current question is answered
  const isCurrentQuestionAnswered = answers[currentQuestion.id] !== undefined;

  // Check if all required questions are answered
  const areAllRequiredQuestionsAnswered = questions.every(
    (q) => !q.required || answers[q.id] !== undefined
  );

  const handleAnswerChange = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion.required && !isCurrentQuestionAnswered) {
      toast.error("Please answer this question to continue");
      return;
    }

    if (isLastQuestion) {
      setShowConfirmDialog(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!areAllRequiredQuestionsAnswered) {
      toast.error("Please answer all required questions");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/dashboard/surveys/${survey.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: Object.entries(answers).map(
              ([questionId, ratingValue]) => ({
                questionId,
                ratingValue,
              })
            ),
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit survey");
      }

      toast.success("Survey submitted successfully!");
      router.push("/home?success=survey_completed");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit survey"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading level="h1">{survey.title}</Heading>
          {survey.description && (
            <p className="text-muted-foreground mt-2">{survey.description}</p>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <QuestionRenderer
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={handleAnswerChange}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
          >
            <ArrowLeft className="size-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentQuestion.required && !isCurrentQuestionAnswered}
          >
            {isLastQuestion ? (
              <>
                <CheckCircle2 className="size-4 mr-2" />
                Review & Submit
              </>
            ) : (
              <>
                Next
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirm Submit Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Survey?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {Object.keys(answers).length} of{" "}
              {questions.length} questions. Once submitted, you cannot change
              your answers.
              {!areAllRequiredQuestionsAnswered && (
                <span className="block mt-2 text-destructive font-medium">
                  Some required questions are not answered. Please go back and
                  complete them.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={!areAllRequiredQuestionsAnswered || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}
