"use client";

import { Heading } from "@/components/ui/heading/heading";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { User } from "@/types/user";
import { SurveyListItem } from "@/types/survey";
import { UserSurveyCard } from "@/components/dashboard/cards/UserSurveyCard";
import { HappinessCard } from "@/components/dashboard/happiness/HappinessCard";
import { Sprout } from "@/components/dashboard/sprout/Sprout";
import { WeeklyHappinessCard } from "@/components/dashboard/cards/WeeklyHappinessCard";
import { OverallHappinessCard } from "@/components/dashboard/cards/OverallHappinessCard";
import { EmployeesInfoCard } from "@/components/dashboard/cards/EmployeesInfoCard";
import { useState, useEffect, useCallback } from "react";
import { getGreeting } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CreateSurveyForm } from "@/components/dashboard/forms/CreateSurveyForm";
import { Badge } from "@/components/ui/badge/badge";
import { useRouter } from "next/navigation";
import {
  CreateSurveyShortcut,
  AnalyticsShortcut,
  TeamsShortcut,
  UsersShortcut,
} from "@/components/ui/shortcuts/shortcuts";

interface HomeClientProps {
  user: User;
  activeSurveys: SurveyListItem[];
  completedSurveyIds: string[];
}

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
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);
  const router = useRouter();

  // Calculate pending surveys from initial data
  const hasPendingSurveys =
    initialActiveSurveys.filter(
      (survey) => !completedSurveyIds.includes(survey.id)
    ).length > 0;

  // Check happiness submission status
  const checkHappinessStatus = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    checkHappinessStatus();
  }, [checkHappinessStatus]);

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
  }, [checkHappinessStatus]);

  const handleSurveyCreated = () => {
    setIsCreateSurveyOpen(false);
    router.refresh();
  };

  return (
    <PageLayout>
      <div className="flex md:items-end gap-10 justify-between flex-col md:flex-row">
        <div>
          <p className="text-xl font-extralight text-muted-foreground lg:text-2xl">
            {getGreeting()}
          </p>
          <Heading level="h1">{user.firstName}</Heading>
        </div>
        {/* {!isLoadingSproutStatus && user.role !== "ADMIN" && (
          <Sprout
            hasPendingSurveys={hasPendingSurveys}
            hasSubmittedHappiness={hasSubmittedHappiness}
          />
        )} */}
      </div>

      {/* Bento Grid Layout */}
      {user.role === "ADMIN" ? (
        <div className="mt-6 grid grid-cols-8 auto-rows-min gap-4">
          <div className="col-span-8 row-span-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <CreateSurveyShortcut onClick={() => setIsCreateSurveyOpen(true)} />
            <AnalyticsShortcut />
            <TeamsShortcut />
            <UsersShortcut />
          </div>

          <div className="col-span-8 lg:col-span-5 lg:row-span-3 lg:row-start-2">
            <WeeklyHappinessCard initialWeeks={12} />
          </div>

          <div className="col-span-8 lg:col-span-3 lg:row-span-1 lg:col-start-6 lg:row-start-2">
            <OverallHappinessCard />
          </div>

          <div className="col-span-8 lg:col-span-3 lg:row-span-2 lg:col-start-6 lg:row-start-3">
            <EmployeesInfoCard />
          </div>

          {/* Survey Cards - Dynamic rows */}
          {initialActiveSurveys.map((survey, index) => (
            <div
              key={survey.id}
              className={`col-span-8 lg:col-span-4 row-span-1 ${
                index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-5"
              }`}
            >
              <UserSurveyCard
                survey={survey}
                hasCompleted={completedSurveyIds.includes(survey.id)}
                isAdmin={user.role === "ADMIN"}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-8 auto-rows-min gap-4">
          {/* Overall Happiness Card */}
          <div className="col-span-8 lg:col-span-5 lg:row-span-2 order-2 lg:order-1">
            {hasSubmittedHappiness ? (
              <OverallHappinessCard />
            ) : (
              <HappinessCard
                hasPendingSurveys={hasPendingSurveys}
                hasSubmittedHappiness={hasSubmittedHappiness}
              />
            )}
          </div>

          {/* Sprout Card */}
          <div className="col-span-8 lg:col-span-3 lg:row-span-2 lg:col-start-6 order-1 lg:order-2">
            {!isLoadingSproutStatus && (
              <Sprout
                hasPendingSurveys={hasPendingSurveys}
                hasSubmittedHappiness={hasSubmittedHappiness}
              />
            )}
          </div>

          {/* Survey Cards - Dynamic rows */}
          {initialActiveSurveys.map((survey, index) => (
            <div
              key={survey.id}
              className={`col-span-8 lg:col-span-4 row-span-1 order-3 ${
                index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-5"
              }`}
            >
              <UserSurveyCard
                survey={survey}
                hasCompleted={completedSurveyIds.includes(survey.id)}
                isAdmin={user.role === "ADMIN"}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create Survey Sheet */}
      <Sheet open={isCreateSurveyOpen} onOpenChange={setIsCreateSurveyOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Create New Survey</SheetTitle>
            <div className="flex justify-between items-baseline">
              <SheetDescription>
                Fill in the details to create a new survey
              </SheetDescription>
              <Badge>DRAFT</Badge>
            </div>
          </SheetHeader>
          <div className="overflow-y-auto px-4">
            <CreateSurveyForm onSuccess={handleSurveyCreated} />
          </div>
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
