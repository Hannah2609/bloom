import { getSession } from "@/lib/session/session";
import Link from "next/link";
import { SearchX, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Heading } from "@/components/ui/heading/heading";

export default async function NotFound() {
  const session = await getSession();
  const isLoggedIn = session.isLoggedIn;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="rounded-full bg-primary/10 p-8">
          <SearchX className="h-24 w-24 text-primary" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <Heading level="h1" className="text-8xl md:text-9xl font-bold">
            404
          </Heading>
          <Heading level="h1" className="text-3xl md:text-4xl">
            Page Not Found
          </Heading>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mt-2">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
      </div>

      <Button asChild size="lg">
        <Link href={isLoggedIn ? "/home" : "/"}>
          {isLoggedIn ? (
            <>
              <LayoutDashboard className="h-5 w-5" />
              Back to Dashboard
            </>
          ) : (
            <>
              <Home className="h-5 w-5" />
              Back to Landing Page
            </>
          )}
        </Link>
      </Button>
    </div>
  );
}
