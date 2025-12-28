import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
