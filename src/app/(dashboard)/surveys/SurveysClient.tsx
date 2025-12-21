import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/ui/layout/dashboard/pageLayout/pageLayout";
import { SurveyListItem } from "@/types/survey";

interface SurveysClientProps {
  initialSurveys: SurveyListItem[];
}

export default function SurveysClient({ initialSurveys }: SurveysClientProps) {
  return (
    <PageLayout>
      <div className="mb-6">
        <Heading level="h1">Surveys</Heading>
        <p className="text-muted-foreground mt-1">Create and manage surveys</p>
      </div>
    </PageLayout>
  );
}
