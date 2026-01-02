"use client";

import { SurveyListItem } from "@/types/survey";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import Link from "next/link";
import { Clock, ChartNoAxesCombined, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserSurveyCardProps {
  survey: SurveyListItem;
  hasCompleted?: boolean;
}

export function UserSurveyCard({
  survey,
  hasCompleted = false,
}: UserSurveyCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (hasCompleted) {
      e.preventDefault();
      toast.error("You have already completed this survey.");
    }
  };

  return (
    <Link href={`/take-surveys/${survey.id}`} onClick={handleClick}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden h-full group">
        <div className="absolute -right-8 -top-8 opacity-[0.08] group-hover:opacity-[0.1] transition-opacity">
          <ChartNoAxesCombined
            className="size-42 md:size-48"
            strokeWidth={1.5}
          />
        </div>

        {hasCompleted && (
          <div className="absolute top-4 right-4 z-10">
            <Badge
              icon={<CheckCircle2 />}
              className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
            >
              Completed
            </Badge>
          </div>
        )}

        <CardHeader className="md:pb-3">
          <div className="space-y-2 min-h-26">
            <CardTitle className="line-clamp-2 text-xl md:text-2xl pr-24 font-medium">
              {survey.title}
            </CardTitle>
            {survey.description && (
              <p className="line-clamp-2 text-sm md:text-base text-foreground/80 leading-relaxed">
                {survey.description}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400">
            <Clock className="size-4" />
            <span className="font-semibold">
              {survey.questionCount} questions
            </span>
            <span>·</span>
            <span className="font-medium">
              ~{Math.ceil(survey.questionCount * 0.5)} min
            </span>
          </div>

          {survey.endDate && (
            <div className="border-t pt-5 flex items-center justify-between">
              <span className="text-xs md:text-sm font-semibold">Closes:</span>
              <span className="text-xs md:text-sm font-semibold">
                {format(new Date(survey.endDate), "d MMM, yyyy")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
