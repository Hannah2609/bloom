"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { PlusIcon } from "lucide-react";
import { PageLayout } from "@/components/ui/layout/dashboard/pageLayout/pageLayout";
import { SurveyListItem } from "@/types/survey";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SurveyCard } from "@/components/dashboard/cards/surveys/SurveyCard";

interface SurveysClientProps {
  initialSurveys: SurveyListItem[];
}

export default function SurveysClient({ initialSurveys }: SurveysClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const surveys = initialSurveys;

  return (
    <>
      <PageLayout>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Heading level="h1">Surveys</Heading>
            <p className="mt-1 text-muted-foreground">
              Create and manage surveys
            </p>
          </div>
          <Button size="lg" onClick={() => setIsOpen(true)}>
            <PlusIcon className="size-4" />
            Create Survey
          </Button>
        </div>

        {surveys.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <p className="mb-4 text-center text-muted-foreground">
              No surveys yet. Create your first survey to get started.
            </p>
            <Button onClick={() => setIsOpen(true)}>
              <PlusIcon className="size-4" />
              Create Survey
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        )}
      </PageLayout>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Create New Survey</SheetTitle>
            <SheetDescription>
              Fill in the details to create a new survey.
            </SheetDescription>
          </SheetHeader>
          <div className="flex h-full items-center">
            {/* TODO: Add CreateSurveyForm component */}
            <p className="text-muted-foreground">Form coming soon...</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
