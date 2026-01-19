import React from "react";
import CompanySignupForm from "@/components/auth/signup/CompanySignupForm";
import Image from "next/image";

export default function CompanySignupPage() {
  return (
    <section className="grid min-h-svh px-8 lg:grid-cols-2 lg:p-3">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[350px]">
          <CompanySignupForm />
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
  );
}
