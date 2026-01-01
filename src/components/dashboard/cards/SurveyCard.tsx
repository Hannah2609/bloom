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
import { Calendar, Users, MessageSquare, Globe } from "lucide-react";

interface SurveyCardProps {
  survey: SurveyListItem;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      case "DRAFT":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800";
      case "CLOSED":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };
  
  return (
    <Link href={`/create-surveys/${survey.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden group h-80">
        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-4 h-12">
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

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
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
            <div className="flex items-center gap-2 text-sm">
              <Globe className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {survey.isGlobal ? "Global survey" : "Team specific"}
              </span>
            </div>

            {(survey.startDate || survey.endDate) && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {survey.startDate && survey.endDate
                    ? `${format(new Date(survey.startDate), "d MMM")} - ${format(new Date(survey.endDate), "d MMM, yyyy")}`
                    : survey.startDate
                      ? `Started ${format(new Date(survey.startDate), "d MMM, yyyy")}`
                      : survey.endDate
                        ? `Closes ${format(new Date(survey.endDate), "d MMM, yyyy")}`
                        : ""}
                </span>
              </div>
            )}

            {!survey.startDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground italic">
                  Not published yet
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
