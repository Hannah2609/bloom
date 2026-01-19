"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { RadialChartView } from "@/components/dashboard/analytics/charts/RadialChartView";
import { useSession } from "@/contexts/SessionContext";
interface OverallHappinessData {
  overallAverage: number;
  totalResponses: number;
  firstResponseDate: string | null;
}

export function OverallHappinessCard() {
  const [data, setData] = useState<OverallHappinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/happiness/overall");
        if (res.ok) {
          const result = await res.json();
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching overall happiness:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="md:h-full">
        <CardHeader>
          <CardTitle>Overall Happiness Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.totalResponses === 0) {
    return null;
  }

  const score = data.overallAverage;

  return (
    <Card className="pb-0!">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Overall Happiness Score for {user?.company?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <RadialChartView score={score} maxScore={5.0} />
      </CardContent>
    </Card>
  );
}
