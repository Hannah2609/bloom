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
import { LineChartView } from "@/components/dashboard/analytics/charts/LineChartView";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { WeeklyHappinessData } from "@/types/analytics";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/SessionContext";

/**
 * Get ISO week number from a date
 * ISO 8601: Week 1 is the first week with at least 4 days in the new year
 */
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const getTeamColor = (index: number): string => {
  const colors = [
    "hsl(200, 90%, 70%)", // Lyseblå
    "hsl(330, 80%, 75%)", // Lyserød
    "hsl(270, 70%, 75%)", // Lilla
    "hsl(30, 90%, 70%)", // Orange
    "hsl(150, 60%, 65%)", // Grøn
  ];
  return colors[index % colors.length];
};

interface WeeklyHappinessCardProps {
  initialWeeks?: number;
}

export function WeeklyHappinessCard({
  initialWeeks = 12,
}: WeeklyHappinessCardProps) {
  const [data, setData] = useState<WeeklyHappinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState(initialWeeks);
  const [filter, setFilter] = useState<"company" | "all-teams">("company");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"weekly" | "monthly">("weekly");
  const { user } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          weeks: weeks.toString(),
          companyLevel: filter === "company" ? "true" : "false",
          viewType: viewType,
        });

        if (selectedTeam && filter === "all-teams") {
          params.append("teamId", selectedTeam);
        }

        const res = await fetch(`/api/dashboard/happiness/weekly?${params}`);
        if (res.ok) {
          const result = await res.json();
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching weekly happiness:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weeks, filter, selectedTeam, viewType]);

  // Get all unique teams from data (using Map to ensure uniqueness by teamId)
  const teamsMap = new Map<string, { id: string; name: string }>();
  data.forEach((week) => {
    week.teamAverages.forEach((team) => {
      if (!teamsMap.has(team.teamId)) {
        teamsMap.set(team.teamId, {
          id: team.teamId,
          name: team.teamName,
        });
      }
    });
  });
  const allTeams = Array.from(teamsMap.values());

  // Prepare chart data
  type ChartDataPoint = {
    week: string;
    weekStart: string;
    company: number;
    [teamName: string]: string | number; // Allow dynamic team names as keys
  };

  const chartData: ChartDataPoint[] = data.map((week) => {
    const date = new Date(week.weekStart);
    const label =
      viewType === "monthly"
        ? format(date, "MMM yyyy")
        : `Week ${getWeekNumber(date)}`;

    const base: ChartDataPoint = {
      week: label,
      weekStart: week.weekStart,
      company: Number(week.companyAverage.toFixed(2)),
    };

    if (filter === "all-teams" && !selectedTeam) {
      // Show all teams
      week.teamAverages.forEach((team) => {
        base[team.teamName] = Number(team.average.toFixed(2));
      });
    } else if (selectedTeam) {
      // Show only selected team
      const team = week.teamAverages.find((t) => t.teamId === selectedTeam);
      if (team) {
        base[team.teamName] = Number(team.average.toFixed(2));
      }
    }

    return base;
  });

  // Calculate current average + trend
  const currentAverage =
    data.length > 0 ? data[data.length - 1]?.companyAverage || 0 : 0;
  const previousAverage =
    data.length > 1 ? data[data.length - 2]?.companyAverage || 0 : 0;
  const trend = currentAverage - previousAverage;

  // Check if chartData has meaningful values (not all zeros)
  const hasChartData = chartData.some(
    (point) =>
      point.company > 0 ||
      Object.keys(point).some(
        (key) =>
          key !== "week" &&
          key !== "weekStart" &&
          typeof point[key] === "number" &&
          point[key] > 0
      )
  );

  // Check if there's actual data to display
  const hasData = data.length > 0 && hasChartData;

  // Build chart config med CSS variabler
  const companyName = user?.company?.name || "Company";
  const chartConfig: Record<string, { label: string; color: string }> = {
    company: {
      label: companyName,
      color: "var(--color-analytics-green)", // Green for company
    },
  };

  // Add teams
  allTeams.forEach((team, index) => {
    chartConfig[team.name] = {
      label: team.name,
      color: getTeamColor(index),
    };
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Happiness Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't render if there's no data
  if (!hasData) {
    return null;
  }

  return (
    <Card className="to-secondary-50! dark:to-secondary-950/50! min-w-0">
      <CardHeader>
        <div className="space-y-4 min-w-0">
          <CardTitle className="text-2xl font-semibold">
            {viewType === "monthly" ? "Monthly" : "Weekly"} Happiness Analytics
          </CardTitle>
          <div className="flex flex-col pt-4 md:pt-0  xl:flex-row xl:items-start gap-4 text-sm justify-between">
            <div className="flex items-center gap-2">
              {trend > 0 ? (
                <TrendingUp className="size-8 text-primary" />
              ) : (
                <TrendingDown className="size-8 text-primary" />
              )}
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
                      {trend > 0 ? "Improvement" : "Decline"} from previous week
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
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

              <Select
                value={filter}
                onValueChange={(value) => {
                  setFilter(value as "company" | "all-teams");
                  setSelectedTeam(null);
                }}
              >
                <SelectTrigger className="h-9 w-[110px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">{companyName}</SelectItem>
                  <SelectItem value="all-teams">All Teams</SelectItem>
                </SelectContent>
              </Select>

              {filter === "all-teams" && allTeams.length > 0 && (
                <Select
                  value={selectedTeam || "all"}
                  onValueChange={(value) =>
                    setSelectedTeam(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="h-9 w-[130px] text-xs">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {allTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>{" "}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <LineChartView
          data={chartData}
          config={chartConfig}
          showCompany={filter === "company"}
          showTeams={filter === "all-teams" ? allTeams : []}
          selectedTeamId={selectedTeam}
          getTeamColor={getTeamColor}
        />
      </CardContent>
    </Card>
  );
}
