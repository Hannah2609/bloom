"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart/chart";
import { TrendingUp, Users } from "lucide-react";
import type { WeeklyHappinessData } from "@/types/analytics";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useMobile";

interface TeamHappinessCardProps {
  teamId: string;
  teamName: string;
  initialWeeks?: number;
}

type ChartDataPoint = {
  week: string;
  weekStart: string;
  team: number;
};

export function TeamHappinessCard({
  teamId,
  teamName,
  initialWeeks = 12,
}: TeamHappinessCardProps) {
  const [data, setData] = useState<WeeklyHappinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState(initialWeeks);
  const [viewType, setViewType] = useState<"weekly" | "monthly">("weekly");
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          weeks: weeks.toString(),
          teamId: teamId,
          companyLevel: "false",
          viewType: viewType,
        });

        const res = await fetch(`/api/dashboard/happiness/weekly?${params}`);
        if (res.ok) {
          const result = await res.json();
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching team happiness:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weeks, teamId, viewType]);

  // Prepare chart data
  const chartData: ChartDataPoint[] = data.map((week) => {
    const date = new Date(week.weekStart);
    const label =
      viewType === "monthly" ? format(date, "MMM yyyy") : format(date, "MMM d");

    // Find team average for this week
    const teamData = week.teamAverages.find((t) => t.teamId === teamId);
    const teamAverage = teamData ? teamData.average : 0;

    return {
      week: label,
      weekStart: week.weekStart,
      team: Number(teamAverage.toFixed(2)),
    };
  });

  // Calculate current average + trend
  const currentAverage =
    data.length > 0
      ? data[data.length - 1]?.teamAverages.find((t) => t.teamId === teamId)
          ?.average || 0
      : 0;
  const previousAverage =
    data.length > 1
      ? data[data.length - 2]?.teamAverages.find((t) => t.teamId === teamId)
          ?.average || 0
      : 0;
  const trend = currentAverage - previousAverage;

  const totalResponses = data.reduce(
    (sum, week) =>
      sum +
      (week.teamAverages.find((t) => t.teamId === teamId)?.responseCount || 0),
    0
  );

  // Chart config
  const chartConfig = {
    team: {
      label: teamName,
      color: "var(--color-analytics-green)",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Team Happiness Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="to-secondary-50! dark:to-secondary-950/50!">
      <CardHeader>
        <div className="space-y-4">
          <CardTitle className="text-xl font-semibold">
            {viewType === "monthly" ? "Monthly" : "Weekly"} Happiness Analytics
          </CardTitle>

          <div className="flex flex-col pt-4 md:pt-0 md:flex-row md:items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <span className="text-muted-foreground">Current: </span>
              <span className="font-bold text-lg">
                {currentAverage.toFixed(2)}
              </span>
              <span className="text-muted-foreground">/ 5.0</span>
              {trend !== 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={`text-xs cursor-help ${
                        trend > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trend > 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(2)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {trend > 0 ? "Improvement" : "Decline"} from previous{" "}
                      {viewType === "monthly" ? "month" : "week"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span className="text-muted-foreground">Total responses: </span>
              <span className="font-semibold">{totalResponses}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Select
              value={viewType}
              onValueChange={(value) =>
                setViewType(value as "weekly" | "monthly")
              }
            >
              <SelectTrigger className="h-9 w-[100px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={weeks.toString()}
              onValueChange={(value) => setWeeks(parseInt(value))}
            >
              <SelectTrigger className="h-9 w-[100px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">
                  {viewType === "monthly" ? "4 months" : "4 weeks"}
                </SelectItem>
                <SelectItem value="8">
                  {viewType === "monthly" ? "8 months" : "8 weeks"}
                </SelectItem>
                <SelectItem value="12">
                  {viewType === "monthly" ? "12 months" : "12 weeks"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={
                  isMobile
                    ? { top: 5, right: 5, bottom: 5, left: -15 }
                    : { top: 5, right: 5, bottom: 5, left: 5 }
                }
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 5]}
                  tick={{ fontSize: 12 }}
                  width={isMobile ? 30 : 60}
                  label={
                    !isMobile
                      ? {
                          value: "Happiness Score",
                          angle: -90,
                          position: "insideLeft",
                        }
                      : undefined
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [
                        `${Number(value).toFixed(2)} / 5.0`,
                        "",
                      ]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="team"
                  stroke={chartConfig.team.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
