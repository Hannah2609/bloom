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
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent transition-colors"
          >
            <RadioGroupItem
              value={option.value.toString()}
              id={`${questionId}-${option.value}`}
            />
            <Label
              htmlFor={`${questionId}-${option.value}`}
              className="flex-1 cursor-pointer font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
