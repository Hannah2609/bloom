"use client";

import Image from "next/image";
import React from "react";
import { Heading } from "@/components/ui/heading/heading";
import { Card, CardContent } from "@/components/ui/card/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SproutProps {
  hasPendingSurveys: boolean;
  hasSubmittedHappiness: boolean;
}

export function Sprout({
  hasPendingSurveys,
  hasSubmittedHappiness,
}: SproutProps) {
  const isHappy = !hasPendingSurveys && hasSubmittedHappiness;

  return (
    <Card className="h-full bg-purple-100 dark:bg-purple-950/50">
      <CardContent className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className={`relative transition-all duration-300 mb-4`}>
          <Popover>
            <PopoverTrigger asChild>
              <button className="cursor-pointer">
                <Image
                  src={isHappy ? "/happy-sprout.png" : "/sad-sprout.png"}
                  alt={isHappy ? "Happy sprout" : "Sad sprout"}
                  className="w-24 h-24 md:w-28 md:h-28"
                  width={120}
                  height={120}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm">
                This is your feedback Sprout, when you give us feedback we water
                it! 💧 Keep it thriving by answering your surveys and weekly
                happiness check-ins.
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Heading level="h3" className="font-medium text-2xl">
            {isHappy ? "Sprout is thriving" : "Sprout is thirsty! 💧"}
          </Heading>
          <p className="text-sm text-foreground">
            {isHappy
              ? "Nothing needs to be done"
              : "Please give us some feedback!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
