"use client";

import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";

interface WaterSproutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasPendingSurveys: boolean;
  hasSubmittedHappiness: boolean;
}

export function WaterSproutDialog({
  open,
  onOpenChange,
  hasPendingSurveys,
  hasSubmittedHappiness,
}: WaterSproutDialogProps) {
  const message = hasPendingSurveys
    ? "We have watered your Sprout with the feedback, but it's still thirsty!"
    : "Your Sprout has been watered with the feedback and is thriving!";

  const isHappy = !hasPendingSurveys && hasSubmittedHappiness;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={true} className="sm:max-w-lg pt-24">
        <DialogHeader className="text-center">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative">
              {/* Water animation lottie */}
              <div className="absolute -top-20 -translate-x-1/2 z-10 w-32 h-32">
                <DotLottieReact
                  src="https://lottie.host/a0d6e7f5-f1b9-42d5-aa83-eeca0f1e7065/6IWZ21pSzj.lottie"
                  loop
                  autoplay
                />
              </div>
              <Image
                src={isHappy ? "/happy-sprout.png" : "/sad-sprout.png"}
                alt={isHappy ? "Happy sprout" : "Sad sprout"}
                width={120}
                height={120}
                className="transition-all duration-300 relative z-0"
                priority
              />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold">
            Thank you for your feedback!
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
