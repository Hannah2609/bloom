"use client";

import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { SurveyListItem } from "@/types/survey";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SurveyAnalyticsCard } from "@/components/dashboard/cards/SurveyAnalyticsCard";

interface SurveyAnalyticsOverviewClientProps {
  initialSurveys: SurveyListItem[];
}

export default function SurveyAnalyticsOverviewClient({
  initialSurveys,
}: SurveyAnalyticsOverviewClientProps) {
  // Filter surveys by status - only ACTIVE and CLOSED with responses
  const activeSurveys = initialSurveys.filter(
    (s) => s.status === "ACTIVE" && s.responseCount > 0
  );
  const closedSurveys = initialSurveys.filter(
    (s) => s.status === "CLOSED" && s.responseCount > 0
  );

  return (
    <PageLayout>
      <div className="mb-8">
        <Heading level="h1">Survey Analytics</Heading>
        <p className="mt-1 text-lg md:text-xl text-muted-foreground">
          View survey results and insights
        </p>
      </div>

      <Tabs defaultValue="ACTIVE">
        <TabsList>
          <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          <TabsTrigger value="CLOSED">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="ACTIVE" className="mt-6">
          {activeSurveys.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              {/* TODO: For anonymity should only display if more than 5-10 responses */}
              <p className="text-center text-muted-foreground">
                No active surveys with responses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeSurveys.map((survey) => (
                <SurveyAnalyticsCard key={survey.id} survey={survey} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="CLOSED" className="mt-6">
          {closedSurveys.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <p className="text-center text-muted-foreground">
                No closed surveys with responses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {closedSurveys.map((survey) => (
                <SurveyAnalyticsCard key={survey.id} survey={survey} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
