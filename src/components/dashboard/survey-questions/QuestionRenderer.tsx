"use client";

import { Question } from "@/types/survey";
import { ScaleQuestion } from "./ScaleQuestion";
import { SatisfactionQuestion } from "./SatisfactionQuestion";
import { AgreementQuestion } from "./AgreementQuestion";

interface QuestionRendererProps {
  question: Question;
  value?: number;
  onChange: (value: number) => void;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
}: QuestionRendererProps) {
  switch (question.answerType) {
    case "SCALE":
      return (
        <ScaleQuestion
          questionId={question.id}
          title={question.title}
          description={question.description}
          required={question.required}
          value={value}
          onChange={onChange}
        />
      );
    case "SATISFACTION":
      return (
        <SatisfactionQuestion
          questionId={question.id}
          title={question.title}
          description={question.description}
          required={question.required}
          value={value}
          onChange={onChange}
        />
      );
    case "AGREEMENT":
      return (
        <AgreementQuestion
          questionId={question.id}
          title={question.title}
          description={question.description}
          required={question.required}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}
