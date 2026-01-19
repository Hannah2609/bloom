"use client";
import Image from "next/image";
import { LoginForm } from "@/components/auth/Login/LoginForm";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function LoginToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasShownToastRef = useRef(false);

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true" && !hasShownToastRef.current) {
      hasShownToastRef.current = true;
      toast.success("Email verified successfully! You can now log in.", {
        duration: 5000,
      });
      // Clean up URL by removing query parameter
      router.replace("/login");
    }
  }, [searchParams, router]);

  return null;
}

function Page() {
  return (
    <Suspense
      fallback={
        <section className="grid min-h-svh px-8 lg:grid-cols-2 lg:p-3">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-[350px]">
              <LoginForm />
            </div>
          </div>
          <div className="relative hidden lg:block">
            <Image
              width={800}
              height={600}
              src="/preview.png"
              alt="Image"
              className="absolute inset-0 h-full w-full rounded-4xl object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </section>
      }
    >
      <section className="grid min-h-svh px-8 lg:grid-cols-2 lg:p-3">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[350px]">
            <LoginForm />
          </div>
        </div>
        <div className="relative hidden lg:block">
          <Image
            width={800}
            height={600}
            src="/preview.png"
            alt="Image"
            className="absolute inset-0 h-full w-full rounded-4xl object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
        <LoginToastHandler />
      </section>
    </Suspense>
  );
}

export default Page;
