import { Button } from "@/components/ui/button/button";
import Header from "@/components/auth/header/header";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/ui/heading/heading";
import { BubbleBackground } from "@/components/ui/animations/bubble";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative min-h-svh">
        <BubbleBackground
          interactive
          className="absolute inset-0 -z-10 hidden lg:block dark:hidden"
        />
        <div className="relative z-10 px-8 flex min-h-svh flex-col sm:items-center justify-center">
          <div className="flex items-start md:items-center">
            <Image
              src="/happy-sprout.png"
              alt="Bloom"
              width={100}
              height={100}
            />
          </div>
          <Heading level="h1" className="font-medium pt-8 text-6xl!">
            Welcome to Bloom
          </Heading>
          <p className="text-muted-foreground py-4 text-2xl">
            Take the first step to building a better team.
          </p>
          <div className="flex flex-col items-center gap-4 py-8 md:flex-row w-full md:w-auto">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/signup/company">
                Get started with your company
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="/signup">
                Get started as an employee
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="text-muted-foreground flex justify-center gap-2 text-center text-sm">
            <p>Not new here?</p>
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
