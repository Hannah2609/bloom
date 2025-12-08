"use client";

import { useSession } from "@/hooks/useSession";
import { SectionCards } from "@/components/ui/card/exampleCards";
import { Heading } from "@/components/ui/heading/heading";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
};

const Page = () => {
  const { user } = useSession();

  return (
    <section className="p-8 flex flex-col gap-10">
      <div className="">
        <Heading
          level="h2"
          variant="muted"
          className="text-2xl! font-extralight"
        >
          {getGreeting()},
        </Heading>
        <Heading level="h2" className="text-3xl!">
          {user?.firstName}
        </Heading>
      </div>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
      </div>
    </section>
  );
};

export default Page;
