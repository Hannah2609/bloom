import React from "react";
import CompanySignupForm from "../../../../components/auth/signup/CompanySignupForm";
import SignupForm from "@/components/auth/signup/SignupForm";

export default function CompanySignupPage() {
  return (
    <div className="flex flex-row items-center pt-20 justify-center gap-20">
      <CompanySignupForm />
      <SignupForm />
    </div>
  );
}
