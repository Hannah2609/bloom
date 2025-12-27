import React from "react";

type AnswerType = "SATISFACTION" | "AGREEMENT" | "SCALE";

type RatingScaleProps = {
  answerType: AnswerType;
  selectedValue?: number; // 1-5
  onSelect?: (value: number) => void;
  disabled?: boolean;
};

const LABELS: Record<AnswerType, string[]> = {
  SATISFACTION: [
    "Ikke tilfreds",
    "Mindre tilfreds",
    "Neutral",
    "Tilfreds",
    "Meget tilfreds",
  ],
  AGREEMENT: ["Uenig", "Delvist uenig", "Neutral", "Delvist enig", "Enig"],
  SCALE: ["1", "2", "3", "4", "5"],
};

const COLORS: Record<AnswerType, { from: string; to: string }> = {
  SATISFACTION: { from: "from-red-500", to: "to-green-500" },
  AGREEMENT: { from: "from-red-500", to: "to-blue-500" },
  SCALE: { from: "from-gray-400", to: "to-gray-600" },
};

export function RatingScale({
  answerType,
  selectedValue,
  onSelect,
  disabled = false,
}: RatingScaleProps) {
  const labels = LABELS[answerType];
  const colors = COLORS[answerType];

  return (
    <div className="space-y-3">
      {/* Rating buttons */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => !disabled && onSelect?.(value)}
            disabled={disabled || !onSelect}
            className={`
              flex-1 h-12 rounded-lg border-2 font-medium transition-all
              ${
                selectedValue === value
                  ? `bg-linear-to-r ${colors.from} ${colors.to} text-white border-transparent`
                  : "hover:border-primary hover:bg-accent border-border"
              }
              ${disabled || !onSelect ? "cursor-default opacity-60" : "cursor-pointer"}
            `}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>

      {/* Optional: Show all labels on hover/selection */}
      {selectedValue && (
        <p className="text-sm text-center font-medium text-primary">
          {labels[selectedValue - 1]}
        </p>
      )}
    </div>
  );
}
