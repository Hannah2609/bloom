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
  const options = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
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
        <div className="flex justify-between gap-2">
          {options.map((option) => (
            <div
              key={option}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <RadioGroupItem
                value={option.toString()}
                id={`${questionId}-${option}`}
                className="size-6"
              />
              <Label
                htmlFor={`${questionId}-${option}`}
                className="cursor-pointer text-sm font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Low</span>
          <span>High</span>
        </div>
      </RadioGroup>
    </div>
  );
}
