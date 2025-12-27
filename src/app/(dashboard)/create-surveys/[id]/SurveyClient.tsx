"use client";

import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge/badge";
import { SurveyDetail } from "@/types/survey";
import { EditQuestionCard } from "@/components/dashboard/cards/EditQuestionCard";
import { useState } from "react";
import { AddQuestionForm } from "@/components/dashboard/survey/AddQuestionForm";

interface SurveyClientProps {
  survey: SurveyDetail;
}

export default function SurveyClient({ survey }: SurveyClientProps) {
  const router = useRouter();
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);

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
            <Heading level={"h1"}>{survey.title}</Heading>
            {survey.isGlobal ? (
              <Badge>Global Survey</Badge>
            ) : (
              <Badge>{survey.teams.length} Team(s)</Badge>
            )}
          </div>

          {survey.description && (
            <p className="text-muted-foreground">{survey.description}</p>
          )}

          <div className="flex gap-4 text-sm text-muted-foreground">
            {survey.startDate && (
              <span>
                Start: {new Date(survey.startDate).toLocaleDateString()}
              </span>
            )}
            {survey.endDate && (
              <span>End: {new Date(survey.endDate).toLocaleDateString()}</span>
            )}
            <span>{survey.responseCount} Responses</span>
          </div>

          {!survey.isGlobal && survey.teams.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium">Teams:</span>
              {survey.teams.map(({ team }) => (
                <Badge key={team.id}>{team.name}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading level={"h2"}>Questions ({survey.questionCount})</Heading>
            <Button onClick={() => setShowAddQuestionForm(true)}>
              <Plus className="size-4" />
              Add Question
            </Button>
          </div>

          {showAddQuestionForm && (
            <AddQuestionForm
              surveyId={survey.id}
              onSuccess={() => setShowAddQuestionForm(false)}
              onCancel={() => setShowAddQuestionForm(false)}
            />
          )}

          {survey.questions.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                No questions yet. Add your first question to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {survey.questions.map((question) => (
                <EditQuestionCard key={question.id} question={question} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
