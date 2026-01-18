import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2Icon className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Verifying your email...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
