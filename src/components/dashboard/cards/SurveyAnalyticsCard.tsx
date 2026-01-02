import { SurveyListItem } from "@/types/survey";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Users, MessageSquare, BarChart3 } from "lucide-react";

interface SurveyAnalyticsCardProps {
  survey: SurveyListItem;
}

export function SurveyAnalyticsCard({ survey }: SurveyAnalyticsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      case "CLOSED":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };

  // Only show surveys with responses
  if (survey.responseCount === 0) {
    return null;
  }

  return (
    <Link href={`/survey-analytics/${survey.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden group h-80">
        {/* Background icon */}
        <div className="absolute -right-8 -top-8 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
          <BarChart3 className="size-48" strokeWidth={1.5} />
        </div>

        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="line-clamp-2 text-xl font-semibold leading-tight flex-1">
              {survey.title}
            </CardTitle>
            <Badge className={`shrink-0 ${getStatusColor(survey.status)}`}>
              {survey.status}
            </Badge>
          </div>

          {survey.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {survey.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="relative space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MessageSquare className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {survey.questionCount}
                </p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10">
              <Users className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {survey.responseCount}
                </p>
                <p className="text-xs text-muted-foreground">Responses</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            {survey.endDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {survey.status === "CLOSED"
                    ? `Closed ${format(new Date(survey.endDate), "d MMM, yyyy")}`
                    : `Closes ${format(new Date(survey.endDate), "d MMM, yyyy")}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
