import { Button } from "@/components/ui/button/button";
import Header from "@/components/ui/layout/auth/header/header";
import Link from "next/link";
import { BubbleBackground } from "@/components/ui/animations/bubble";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* <BubbleBackground interactive> */}
        <div className="flex flex-col items-center justify-center min-h-svh">
          <h1 className="text-4xl font-bold">Welcome to Bloom</h1>
          <p className="text-muted-foreground py-4 text-lg">
            Take the first step to building a better team.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 py-8">
            <Button size="lg" asChild>
              <Link href="/signup-company">
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
          <div className="text-center text-sm flex gap-2 justify-center text-muted-foreground">
            <p>Not new here?</p>
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
        {/* </BubbleBackground> */}
      </main>
    </>
  );
}
