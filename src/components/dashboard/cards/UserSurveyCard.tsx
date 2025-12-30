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
import { Clock } from "lucide-react";
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
      <Card className="cursor-pointer transition-shadow hover:shadow-lg relative">
        {hasCompleted && (
          <div className="absolute top-4 right-4">
            <Badge>Completed</Badge>
          </div>
        )}
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="line-clamp-2">{survey.title}</CardTitle>
            {survey.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {survey.description}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{survey.questionCount} questions</span>
            <span>·</span>
            <span>~{Math.ceil(survey.questionCount * 0.5)} min</span>
          </div>

          {survey.endDate && (
            <div className="border-t pt-2 text-xs text-muted-foreground">
              Closes: {format(new Date(survey.endDate), "d MMM, yyyy")}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
