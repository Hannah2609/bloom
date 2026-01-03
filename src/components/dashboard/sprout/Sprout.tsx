"use client";

import Image from "next/image";
import React from "react";
import { Heading } from "@/components/ui/heading/heading";
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
    <div className="flex md:flex-row-reverse items-end">
      <div className={`relative transition-all duration-300`}>
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
      <div className="flex flex-col md:items-end gap-1">
        <Heading level="h3" variant="muted">
          {isHappy ? "Sprout is thriving" : "Sprout is thirsty! 💧"}
        </Heading>
        <p className="text-sm text-foreground pb-1">
          {isHappy
            ? "Nothing needs to be done"
            : "Please give us some feedback!"}
        </p>
      </div>
    </div>
  );
}
