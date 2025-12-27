import { Button } from "@/components/ui/button/button";
import Header from "@/components/auth/header/header";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/ui/heading/heading";
import { BubbleBackground } from "@/components/ui/animations/bubble";

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative min-h-svh">
        <BubbleBackground
          interactive
          className="absolute inset-0 -z-10 hidden lg:block dark:hidden"
        />
        <div className="relative z-10 flex min-h-svh flex-col items-center justify-center">
          <Heading level="h1">Welcome to Bloom</Heading>
          <p className="text-muted-foreground py-4 text-lg">
            Take the first step to building a better team.
          </p>
          <div className="flex flex-col items-center gap-4 py-8 md:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup/company">
                Get started with your company
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
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
