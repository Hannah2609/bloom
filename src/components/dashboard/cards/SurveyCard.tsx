import { SurveyListItem } from "@/types/survey";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge/badge";
import Link from "next/link";

interface SurveyCardProps {
  survey: SurveyListItem;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  return (
    // TODO: Link to slug edit survey if admin and slug take survey if other roles
    <Link href={`/surveys/${survey.id}`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <CardTitle className="line-clamp-2">{survey.title}</CardTitle>
              {survey.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {survey.description}
                </p>
              )}
            </div>
            <Badge>{survey.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions:</span>
              <span className="font-medium">{survey.questionCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Responses:</span>
              <span className="font-medium">{survey.responseCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scope:</span>
              <span className="font-medium">
                {survey.isGlobal ? "All teams" : "Specific teams"}
              </span>
            </div>
          </div>

          {survey.startDate ? (
            <div className="border-t pt-2 text-xs text-muted-foreground">
              Started: {new Date(survey.startDate).toLocaleDateString()}
            </div>
          ) : (
            <div className="border-t pt-2 text-xs text-muted-foreground">
              Not published
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
