"use client";

import Link from "next/link";
import { ArrowUpRight, Plus, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card/card";
import { cn } from "@/lib/utils";

interface ShortcutCardProps {
  className?: string;
}

export function CreateSurveyShortcut({
  onClick,
  className,
}: ShortcutCardProps & { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn("relative w-full h-full group", className)}
    >
      <Card className="bg-primary dark:bg-primary/80 hover:opacity-90 transition-opacity">
        <CardContent className=" lg:px-6 px-4 h-full flex flex-col text-left">
          <p className="text-sm font-medium text-primary-foreground/60 mt-2">
            Quick Action
          </p>
          <p className="md:text-md lg:text-[22px] text-base font-semibold text-primary-foreground">
            Create Survey
          </p>
          <div className="flex group-hover:bg-accent/80 dark:bg-card absolute top-4 right-4 lg:right-6 bg-accent p-2 items-center rounded-full">
            <Plus className="size-5 text-foreground" />
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

export function AnalyticsShortcut({ className }: ShortcutCardProps) {
  return (
    <Link
      href="/survey-analytics"
      className={cn("relative w-full h-full group", className)}
    >
      <Card className="hover:bg-accent transition-colors">
        <CardContent className=" lg:px-6 px-4 h-full flex flex-col">
          <p className="text-sm font-medium text-muted-foreground mt-2">
            Analytics
          </p>
          <p className="md:text-md lg:text-[22px] text-base font-semibold text-foreground">
            Survey Analytics
          </p>
          <div className="flex group-hover:bg-primary/80 absolute top-4 right-4 lg:right-6 bg-primary p-2 items-center rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight className="size-5 text-foreground dark:text-card" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function TeamsShortcut({ className }: ShortcutCardProps) {
  return (
    <Link
      href="/teams"
      className={cn("relative w-full h-full group", className)}
    >
      <Card className="hover:bg-accent transition-colors">
        <CardContent className=" lg:px-6 px-4 h-full flex flex-col">
          <p className="text-sm font-medium text-muted-foreground mt-2">
            Teams
          </p>
          <p className="md:text-md lg:text-[22px] text-base font-semibold text-foreground">
            Manage Teams
          </p>
          <div className="flex group-hover:bg-primary/80 absolute top-4 right-4 lg:right-6 bg-primary p-2 items-center rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight className="size-5 text-foreground dark:text-card" />
          </div>{" "}
        </CardContent>
      </Card>
    </Link>
  );
}

export function UsersShortcut({ className }: ShortcutCardProps) {
  return (
    <Link
      href="/admin"
      className={cn("relative w-full h-full group", className)}
    >
      <Card className="hover:bg-accent transition-colors">
        <CardContent className=" lg:px-6 px-4 h-full flex flex-col">
          <p className="text-sm font-medium text-muted-foreground mt-2">
            Users
          </p>
          <p className="md:text-md lg:text-[22px] text-base font-semibold text-foreground">
            Manage Users
          </p>
          <div className="flex group-hover:bg-primary/80 absolute top-4 right-4 lg:right-6 bg-primary p-2 items-center rounded-full group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
            <ArrowUpRight className="size-5 text-foreground dark:text-card" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
