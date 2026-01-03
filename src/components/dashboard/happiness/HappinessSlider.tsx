"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface HappinessSliderProps {
  onSubmit: (score: number) => Promise<void>;
}

export function HappinessSlider({ onSubmit }: HappinessSliderProps) {
  const [value, setValue] = useState([6]); // Default to middle (3.0) - slider value 6 = score 3.0
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert slider value (0-8) to score (1.0-5.0 in 0.5 increments)
  // Slider: 0 -> Score: 1.0, Slider: 8 -> Score: 5.0
  const getScore = (sliderValue: number) => {
    return 1 + sliderValue * 0.5; // 0 -> 1.0, 8 -> 5.0
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const score = getScore(value[0]);
      await onSubmit(score);
    } catch (error) {
      console.error("Error submitting happiness score:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayValue = getScore(value[0]);

  // Calculate gradient color based on score
  // Under 2: red, 2-3.5: yellow, 4-5: green (primary)
  const getRangeClassName = (score: number) => {
    if (score < 2) {
      return "bg-gradient-to-r from-destructive to-destructive/50";
    } else if (score >= 2 && score < 4) {
      return "bg-gradient-to-r from-secondary-300 to-secondary-300/50";
    } else {
      return "bg-gradient-to-r from-primary to-primary/50";
    }
  };

  // Get text color based on score
  const getTextColor = (score: number) => {
    if (score < 2) {
      return "text-destructive";
    } else if (score >= 2 && score < 4) {
      return "text-secondary-400 dark:text-secondary-200";
    } else {
      return "text-primary-500 dark:text-primary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-center pt-2">
          <span
            className={cn("text-3xl font-semibold", getTextColor(displayValue))}
          >
            {displayValue.toFixed(1)}
          </span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={8}
          step={1}
          className="w-full"
          rangeClassName={getRangeClassName(displayValue)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
