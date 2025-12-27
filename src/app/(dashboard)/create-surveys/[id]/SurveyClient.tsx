"use client";

import { PageLayout } from "@/components/ui/layout/dashboard/pageLayout/pageLayout";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge/badge";
import { SurveyDetail } from "@/types/survey";

interface SurveyClientProps {
  survey: SurveyDetail;
}

export default function SurveyClient({ survey }: SurveyClientProps) {
  const router = useRouter();

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
            <Button>
              <Plus className="size-4" />
              Add Question
            </Button>
          </div>

          {survey.questions.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                No questions yet. Add your first question to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {survey.questions.map((question) => (
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
                          <span className="text-xs text-muted-foreground">
                            * Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
