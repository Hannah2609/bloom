"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SurveyDetail } from "@/types/survey";
import { Button } from "@/components/ui/button/button";
import { QuestionRenderer } from "@/components/dashboard/survey-questions/QuestionRenderer";
import { Card, CardContent } from "@/components/ui/card/card";
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
      router.push("/home");
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
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <Heading level="h1">{survey.title}</Heading>
          {survey.description && (
            <p className="text-muted-foreground">{survey.description}</p>
          )}
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-12 space-y-10">
            {/* Progress */}
            <div className="flex flex-col items-center -mt-6 md:-mt-10 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {currentQuestionIndex + 1}/{questions.length}
              </p>
              <Progress value={progress} className="h-2 w-36 md:w-48" />
            </div>

            {/* Question */}
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <QuestionRenderer
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={handleAnswerChange}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-2 md:pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                size="lg"
              >
                <ArrowLeft className="size-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={
                  currentQuestion.required && !isCurrentQuestionAnswered
                }
                size="lg"
              >
                {isLastQuestion ? (
                  <>
                    Submit
                    <CheckCircle2 className="size-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
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
