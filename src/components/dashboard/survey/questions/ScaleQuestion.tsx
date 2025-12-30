"use client";

import { Label } from "@/components/ui/forms/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/forms/radio-group";

interface ScaleQuestionProps {
  questionId: string;
  title: string;
  description?: string | null;
  required: boolean;
  value?: number;
  onChange: (value: number) => void;
}

export function ScaleQuestion({
  questionId,
  title,
  description,
  required,
  value,
  onChange,
}: ScaleQuestionProps) {
  const options = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col justify-center items-center pb-4">
        <Label className="text-xl font-medium">
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
