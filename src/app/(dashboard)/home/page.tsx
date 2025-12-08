"use client";

import { useSession } from "@/hooks/useSession";
import { SectionCards } from "@/components/ui/card/exampleCards";
import { Heading } from "@/components/ui/heading/heading";

// TODO: move to utils
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
};

const Page = () => {
  const { user } = useSession();

  return (
    <section className="flex flex-col gap-10 p-8">
      <div>
        <p
          className="font-extralight text-muted-foreground text-xl lg:text-2xl"
        >
          {getGreeting()}
        </p>
        <Heading level="h1">
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
