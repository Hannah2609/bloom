"use client";

import { Label } from "@/components/ui/forms/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/forms/radio-group";

interface SatisfactionQuestionProps {
  questionId: string;
  title: string;
  description?: string | null;
  required: boolean;
  value?: number;
  onChange: (value: number) => void;
}

export function SatisfactionQuestion({
  questionId,
  title,
  description,
  required,
  value,
  onChange,
}: SatisfactionQuestionProps) {
  const options = [
    { value: 1, label: "Very dissatisfied" },
    { value: 2, label: "Dissatisfied" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Satisfied" },
    { value: 5, label: "Very satisfied" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium">
          {title}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </div>

      <RadioGroup
        value={value?.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
      >
        <div className="relative">
          {/* Radio buttons */}
          <div className="relative flex justify-between gap-2">
            {options.map((option, index) => (
              <div
                key={option.value}
                className="flex flex-col items-center gap-2 flex-1 relative"
              >
                {/* Connecting line (only between dots) */}
                {index > 0 && (
                  <div className="absolute top-3 right-1/2 w-full h-0.5 bg-border" />
                )}

                <RadioGroupItem
                  value={option.value.toString()}
                  id={`${questionId}-${option.value}`}
                  className="size-6 bg-background z-10"
                />
                {option.label && (
                  <Label
                    htmlFor={`${questionId}-${option.value}`}
                    className="cursor-pointer text-xs md:text-sm font-medium text-bg text-center pt-2"
                  >
                    {option.label}
                  </Label>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs md:text-sm text-muted-foreground mt-8">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
