"use client";
import Image from "next/image";
import { LoginForm } from "@/components/auth/Login/LoginForm";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function Page() {
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

  return (
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
          src="/placeholder.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full rounded-4xl object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </section>
  );
}

export default Page;
