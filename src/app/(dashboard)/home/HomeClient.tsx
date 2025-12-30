"use client";

import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { User } from "@/types/user";
import { SurveyGrid } from "@/components/dashboard/layout/SurveyGrid";
import { SurveyListItem } from "@/types/survey";
import { HappinessCard } from "@/components/dashboard/happiness/HappinessCard";

interface HomeClientProps {
  user: User;
  activeSurveys: SurveyListItem[];
}

// TODO: move to utils
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function HomeClient({ user, activeSurveys }: HomeClientProps) {
  return (
    <PageLayout>
      <div>
        <p className="text-xl font-extralight text-muted-foreground lg:text-2xl">
          {getGreeting()}
        </p>
        <Heading level="h1">{user.firstName}</Heading>
      </div>
      
      {/* Happiness Card */}
      <div className="mt-6">
        <HappinessCard userId={user.id} companyId={user.companyId} />
      </div>

      <div className="mt-10">
        <SurveyGrid surveys={activeSurveys} emptyMessage="No active surveys" />
      </div>
    </PageLayout>
  );
}
