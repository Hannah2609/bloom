"use client";

import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { User } from "@/types/user";
import { SurveyListItem } from "@/types/survey";
import { UserSurveyCard } from "@/components/dashboard/cards/UserSurveyCard";
import { getHours } from "date-fns";

interface HomeClientProps {
  user: User;
  activeSurveys: SurveyListItem[];
  completedSurveyIds: string[];
}

const getGreeting = () => {
  const hour = getHours(new Date());
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function HomeClient({
  user,
  activeSurveys,
  completedSurveyIds,
}: HomeClientProps) {
  return (
    <PageLayout>
      <div>
        <p className="text-xl font-extralight text-muted-foreground lg:text-2xl">
          {getGreeting()}
        </p>
        <Heading level="h1">{user.firstName}</Heading>
      </div>
      <div className="mt-10">
        {activeSurveys.length === 0 ? (
          <p className="text-muted-foreground">No active surveys</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {activeSurveys.map((survey) => (
              <UserSurveyCard
                key={survey.id}
                survey={survey}
                hasCompleted={completedSurveyIds.includes(survey.id)}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
