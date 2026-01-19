"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card/card";
import { Users } from "lucide-react";

export function EmployeesInfoCard() {
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/users");
        if (res.ok) {
          const result = await res.json();
          setEmployeeCount(result.users?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching employee count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeCount();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full p-6">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-purple-100 dark:bg-purple-900/80">
      <CardContent className="flex items-center justify-between">
        <Users className="size-9 text-primary-500" />
        <p className="text-2xl font-medium text-foreground">
          {employeeCount ?? 0}
          <span>{employeeCount === 1 ? " Employee" : " Employees"}</span>
        </p>
      </CardContent>
    </Card>
  );
}
