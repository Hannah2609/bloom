"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validation/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { Button } from "../../ui/button/button";
import { PasswordInput } from "../../ui/forms/passwordInput";
import { useSignup } from "@/hooks/useSignup";
import { SignupSchema, emailOnlySchema } from "@/lib/validation/validation";
import { Role } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PendingCompanyInfo = {
  id: string;
  name: string;
  domain: string;
  role: Role;
  email?: string;
};

type SignupProfileFormProps = {
  pendingCompany?: PendingCompanyInfo;
};

export default function SignupProfileForm({
  pendingCompany,
}: SignupProfileFormProps) {
  const router = useRouter();
  const { signup, isSubmitting } = useSignup();
  const [emailChecked, setEmailChecked] = useState(!!pendingCompany);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: {
      email: "",
    },
  });

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: pendingCompany?.email || "",
      password: "",
    },
  });

  // Update email in form when pendingCompany.email is available
  useEffect(() => {
    if (pendingCompany?.email) {
      form.setValue("email", pendingCompany.email);
    }
  }, [pendingCompany?.email, form]);

  const checkEmailDomain = async (email: string) => {
    try {
      setCheckingEmail(true);
      const response = await fetch("/api/auth/check-email-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.hasCompany && data.company) {
        // Set session with EMPLOYEE role and redirect
        const sessionResponse = await fetch("/api/auth/set-pending-company", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyId: data.company.id,
            role: Role.EMPLOYEE,
            email: email,
          }),
        });

        if (sessionResponse.ok) {
          router.push(data.redirectUrl);
          return;
        }
      }

      // No company found, show full form
      setEmailChecked(true);
      form.setValue("email", email);
    } catch (error) {
      console.error("Error checking email domain:", error);
      toast.error("Failed to check email. Please try again.");
    } finally {
      setCheckingEmail(false);
    }
  };

  // Show email-first step if no pendingCompany and email not checked yet
  if (!pendingCompany && !emailChecked) {
    return (
      <Form {...emailForm}>
        <form
          onSubmit={emailForm.handleSubmit((values) =>
            checkEmailDomain(values.email)
          )}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Get started</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email to continue
            </p>
          </div>

          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                    disabled={checkingEmail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={checkingEmail}>
              {checkingEmail ? "Checking..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const success = await signup(values);
          if (success) {
            form.reset();
          }
        })}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {pendingCompany
              ? pendingCompany.role === Role.ADMIN
                ? `Create the first user for ${pendingCompany.name}`
                : `Finish signing up for ${pendingCompany.name}`
              : "Get started"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {pendingCompany
              ? pendingCompany.role === Role.ADMIN
                ? "We'll automatically assign the admin role and connect you to the company - you can always change this and add more admins later"
                : "Complete your profile to join the company"
              : "Create your account to get started on Bloom"}
          </p>
        </div>

        {pendingCompany && (
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-left text-sm">
            <p className="font-medium">
              {pendingCompany.role === Role.ADMIN
                ? `Admin signup for ${pendingCompany.name}`
                : `Signup for ${pendingCompany.name}`}
            </p>
            <p className="text-muted-foreground text-xs">
              Domain: {pendingCompany.domain}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John"
                  autoComplete="first-name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Doe"
                  autoComplete="last-name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Only show email field if not employee (they already entered it) */}
        {!(pendingCompany && pendingCompany.role === Role.EMPLOYEE) && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Show email as read-only for employees */}
        {pendingCompany &&
          pendingCompany.role === Role.EMPLOYEE &&
          pendingCompany.email && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {pendingCompany.email}
              </div>
            </div>
          )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
