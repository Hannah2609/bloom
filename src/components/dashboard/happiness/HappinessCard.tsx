"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { HappinessSlider } from "./HappinessSlider";
import { Smile } from "lucide-react";

interface HappinessCardProps {
  userId: string;
  companyId: string;
}

export function HappinessCard({ userId, companyId }: HappinessCardProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

      setHasSubmitted(true);
    } catch (error) {
      console.error("Error submitting happiness score:", error);
      throw error; // Re-throw to let HappinessSlider handle it
    }
  };

  if (isLoading) return null;
  if (hasSubmitted) return null; // Hide card after submission

  return (
    <Card className="border-primary/20 bg-black to-black! text-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smile className="h-5 w-5 text-primary" />
          <CardTitle>How happy have you been this week?</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <HappinessSlider onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
