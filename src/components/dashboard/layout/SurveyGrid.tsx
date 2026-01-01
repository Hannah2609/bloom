import { SurveyListItem } from "@/types/survey";
import { SurveyCard } from "@/components/dashboard/cards/SurveyCard";

interface SurveyGridProps {
  surveys: SurveyListItem[];
  emptyMessage: string;
}

export const SurveyGrid = ({ surveys, emptyMessage }: SurveyGridProps) => {
  if (surveys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-center text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} />
      ))}
    </div>
  );
};
