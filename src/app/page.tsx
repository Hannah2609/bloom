import { Button } from "@/components/ui/button/button";
import Header from "@/components/ui/layout/auth/header/header";
import Link from "next/link";
import { BubbleBackground } from "@/components/ui/animations/bubble";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* <BubbleBackground interactive> */}
        <div className="flex flex-col items-center justify-center py-40">
          <h1 className="text-4xl font-bold">Welcome to Bloom</h1>
          <p className="text-muted-foreground py-4 text-lg">
            Take the first step to building a better team.
          </p>
          <div className="flex items-center gap-4 py-8">
            <Button asChild>
              <Link href="/signup-company">Get started with your company</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Get started as an employee</Link>
            </Button>
          </div>
        </div>
        {/* </BubbleBackground> */}
      </main>
    </>
  );
}
