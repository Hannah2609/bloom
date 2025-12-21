"use client";
import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/ui/layout/dashboard/pageLayout/pageLayout";
import { SurveyListItem } from "@/types/survey";
import CreateSurveyForm from "@/components/dashboard/forms/CreateSurveyForm";

interface SurveysClientProps {
  initialSurveys: SurveyListItem[];
}

export default function SurveysClient({ initialSurveys }: SurveysClientProps) {
  return (
    <PageLayout>
      <div className="mb-6">
        <Heading level="h1">Surveys</Heading>
        <p className="text-muted-foreground mt-1">Create and manage surveys</p>
        <CreateSurveyForm
          onSuccess={() => {
            // Refresh surveys list or any other action after survey creation
          }}
        />
      </div>
    </PageLayout>
  );
}
