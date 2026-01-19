"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { HappinessSlider } from "./HappinessSlider";
import { HatGlasses } from "lucide-react";
import { notifyHappinessSubmitted } from "@/lib/sprout";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WaterSproutDialog } from "../sprout/WaterSproutDialog";

interface HappinessCardProps {
  hasPendingSurveys: boolean;
  hasSubmittedHappiness: boolean;
}

export function HappinessCard({ hasPendingSurveys }: HappinessCardProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWaterSproutDialog, setShowWaterSproutDialog] = useState(false);

  useEffect(() => {
    checkSubmissionStatus();
  }, []);

  const checkSubmissionStatus = async () => {
    try {
      const res = await fetch("/api/dashboard/happiness");
      if (!res.ok) throw new Error("Failed to check status");
      const data = await res.json();
      setHasSubmitted(data.hasSubmitted);
    } catch (error) {
      console.error("Error checking happiness status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (score: number) => {
    try {
      const res = await fetch("/api/dashboard/happiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit");
      }

      // Show thank you modal
      setShowWaterSproutDialog(true);
      setHasSubmitted(true);

      // Notify sprout status update
      notifyHappinessSubmitted();
    } catch (error) {
      console.error("Error submitting happiness score:", error);
      throw error; // Re-throw to let HappinessSlider handle it
    }
  };

  if (isLoading) return null;

  // Handle modal close
  const handleModalClose = () => {
    setShowWaterSproutDialog(false);
  };

  return (
    <>
      <WaterSproutDialog
        open={showWaterSproutDialog}
        onOpenChange={handleModalClose}
        hasPendingSurveys={hasPendingSurveys}
        hasSubmittedHappiness={true} // Always true after submission
      />
      {!hasSubmitted && (
        <Card className="border-none bg-blue-100 dark:bg-blue-950/50">
          <CardHeader>
            <div className="flex flex-col items-center gap-2">
              {/* <Smile className="h-10 w-10 text-primary" /> */}
              <CardTitle className="text-2xl font-semibold">
                Your weekly happiness check-in
              </CardTitle>

              <CardDescription className="flex items-center gap-2">
                How happy have you been this week rating 1-5?
                <Tooltip>
                  <TooltipTrigger>
                    <HatGlasses className="h-6 w-6 rounded-full bg-primary-300 p-1 dark:text-primary-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    All your answers are anonymous and will not be shared with
                    anyone.
                  </TooltipContent>
                </Tooltip>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <HappinessSlider onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
