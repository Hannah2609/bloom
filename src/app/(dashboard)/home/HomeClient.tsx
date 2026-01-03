"use client";

import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { User } from "@/types/user";
import { SurveyListItem } from "@/types/survey";
import { UserSurveyCard } from "@/components/dashboard/cards/UserSurveyCard";
import { getHours } from "date-fns";
import { HappinessCard } from "@/components/dashboard/happiness/HappinessCard";
import { Sprout } from "@/components/dashboard/sprout/Sprout";
import { useState, useEffect } from "react";

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
  activeSurveys: initialActiveSurveys,
  completedSurveyIds: initialCompletedSurveyIds,
}: HomeClientProps) {
  const [hasSubmittedHappiness, setHasSubmittedHappiness] = useState(false);
  const [isLoadingSproutStatus, setIsLoadingSproutStatus] = useState(true);
  const [completedSurveyIds, setCompletedSurveyIds] = useState(
    initialCompletedSurveyIds
  );

  // Calculate pending surveys from initial data
  const hasPendingSurveys =
    initialActiveSurveys.filter(
      (survey) => !completedSurveyIds.includes(survey.id)
    ).length > 0;

  // Check happiness submission status
  const checkHappinessStatus = async () => {
    try {
      const res = await fetch("/api/dashboard/happiness");
      if (res.ok) {
        const data = await res.json();
        setHasSubmittedHappiness(data.hasSubmitted);
      }
    } catch (error) {
      console.error("Error checking happiness status:", error);
    } finally {
      setIsLoadingSproutStatus(false);
    }
  };

  useEffect(() => {
    checkHappinessStatus();
  }, []);

  // Listen for feedback submission to update state
  useEffect(() => {
    const handleFeedbackSubmitted = (event: Event) => {
      const customEvent = event as CustomEvent<{ surveyId?: string }>;

      // If survey was submitted, add it to completed list
      if (customEvent.detail?.surveyId) {
        setCompletedSurveyIds((prev) => {
          if (prev.includes(customEvent.detail.surveyId!)) {
            return prev; // Already completed
          }
          return [...prev, customEvent.detail.surveyId!];
        });
      }

      // Always refresh happiness status
      checkHappinessStatus();
    };

    window.addEventListener("feedback-submitted", handleFeedbackSubmitted);

    return () => {
      window.removeEventListener("feedback-submitted", handleFeedbackSubmitted);
    };
  }, []);

  return (
    <PageLayout>
      <div className="flex md:items-end gap-10 justify-between flex-col md:flex-row">
        <div>
          <p className="text-xl font-extralight text-muted-foreground lg:text-2xl">
            {getGreeting()}
          </p>
          <Heading level="h1">{user.firstName}</Heading>
        </div>
        {!isLoadingSproutStatus && user.role !== "ADMIN" && (
          <Sprout
            hasPendingSurveys={hasPendingSurveys}
            hasSubmittedHappiness={hasSubmittedHappiness}
          />
        )}
      </div>

      {/* Happiness Card */}
      {user.role !== "ADMIN" && (
        <div className="mt-6">
          <HappinessCard
            hasPendingSurveys={hasPendingSurveys}
            hasSubmittedHappiness={hasSubmittedHappiness}
          />
        </div>
      )}

      <div className="mt-10">
        {initialActiveSurveys.length === 0 ? (
          <p className="text-muted-foreground">No active surveys</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {initialActiveSurveys.map((survey) => (
              <UserSurveyCard
                key={survey.id}
                survey={survey}
                hasCompleted={completedSurveyIds.includes(survey.id)}
                isAdmin={user.role === "ADMIN"}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
