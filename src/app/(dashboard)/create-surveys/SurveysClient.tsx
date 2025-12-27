"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { PlusIcon } from "lucide-react";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { SurveyListItem } from "@/types/survey";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SurveyGrid } from "@/components/dashboard/layout/SurveyGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateSurveyForm } from "@/components/dashboard/forms/CreateSurveyForm";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge/badge";

interface SurveysClientProps {
  initialSurveys: SurveyListItem[];
}

export default function SurveysClient({ initialSurveys }: SurveysClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Filter surveys by status
  const draftSurveys = initialSurveys.filter((s) => s.status === "DRAFT");
  const activeSurveys = initialSurveys.filter((s) => s.status === "ACTIVE");
  const closedSurveys = initialSurveys.filter((s) => s.status === "CLOSED");
  const archivedSurveys = initialSurveys.filter((s) => s.status === "ARCHIVED");

  // Refresh surveys after creating a new one
  const handleSurveyCreated = () => {
    setIsOpen(false);
    // Refresh the page to get updated data from server
    router.refresh();
  };

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

        <Tabs defaultValue="DRAFT">
          <TabsList>
            <TabsTrigger value="DRAFT">Draft</TabsTrigger>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="CLOSED">Closed</TabsTrigger>
            <TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="DRAFT" className="mt-6">
            <SurveyGrid
              surveys={draftSurveys}
              emptyMessage="No draft surveys."
            />
          </TabsContent>

          <TabsContent value="ACTIVE" className="mt-6">
            <SurveyGrid
              surveys={activeSurveys}
              emptyMessage="No active surveys."
            />
          </TabsContent>

          <TabsContent value="CLOSED" className="mt-6">
            <SurveyGrid
              surveys={closedSurveys}
              emptyMessage="No closed surveys."
            />
          </TabsContent>

          <TabsContent value="ARCHIVED" className="mt-6">
            <SurveyGrid
              surveys={archivedSurveys}
              emptyMessage="No archived surveys."
            />
          </TabsContent>
        </Tabs>
      </PageLayout>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Create New Survey</SheetTitle>
            <SheetDescription>
              <div className="flex justify-between items-baseline">
                Fill in the details to create a new survey.
                <Badge>DRAFT</Badge>
              </div>
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-4 ">
            <CreateSurveyForm onSuccess={handleSurveyCreated} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
