"use client";

import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuestionAnalyticsCard } from "@/components/dashboard/analytics/QuestionAnalyticsCard";
import { Badge } from "@/components/ui/badge/badge";
import type { SurveyAnalytics } from "@/types/analytics";

interface AnalyticsClientProps {
  analytics: SurveyAnalytics;
}

export default function AnalyticsClient({ analytics }: AnalyticsClientProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      case "CLOSED":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/create-surveys")}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to analytics overview
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <Heading level="h1">{analytics.title}</Heading>
                <Badge className={getStatusColor(analytics.status)}>
                  {analytics.status}
                </Badge>
              </div>
              {analytics.description && (
                <p className="text-muted-foreground text-lg">
                  {analytics.description}
                </p>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total Responses:</span>
              <span className="font-bold text-lg">
                {analytics.totalResponses}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Questions:</span>
              <span className="font-bold text-lg">
                {analytics.questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Visibility:</span>
              <span className="font-semibold">
                {analytics.isGlobal ? "Global" : "Team specific"}
              </span>
            </div>
          </div>
        </div>

        {/* Questions Analytics */}
        <div>
          {analytics.questions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No responses yet for this survey.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics.questions.map((question) => (
                <QuestionAnalyticsCard
                  key={question.questionId}
                  data={question}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
