import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { loginSchema, LoginSchema } from "@/lib/validation/validation";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/ui/forms/passwordInput";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { Heading } from "@/components/ui/heading/heading";
import { ResetPassword } from "../resetPassword/ResetPassword";
import { VerifyEmail } from "../verifyEmail/VerifyEmail";
import { useState } from "react";

export const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [showVerificationLink, setShowVerificationLink] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    const result = await login(data);
    if (result?.requiresVerification) {
      setShowVerificationLink(true);
      setVerificationEmail(data.email);
    } else {
      setShowVerificationLink(false);
      setVerificationEmail("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Heading level="h2" className="text-2xl font-bold">
            Log in
          </Heading>
          <Heading
            level="h3"
            variant="muted"
            className="mb-6 text-lg! font-normal!"
          >
            Welcome back Bloomer!
          </Heading>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="bg-transparent"
                  type="email"
                  autoComplete="email"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="relative flex justify-between">
                <FormLabel>Adgangskode</FormLabel>
                <ResetPassword />
              </div>
              <FormControl>
                <PasswordInput
                  className="bg-transparent"
                  autoComplete="current-password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              Logging in...
              <Loader2Icon className="size-4 animate-spin" />
            </>
          ) : (
            <>
              Login
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        {showVerificationLink && (
          <div className="text-muted-foreground flex justify-center text-center text-sm">
            <VerifyEmail defaultEmail={verificationEmail} />
          </div>
        )}

        <div className="text-muted-foreground flex justify-center gap-2 text-center text-sm">
          <p>Don&apos;t have an account?</p>
          <Link href="/signup" className="underline underline-offset-4">
            Signup
          </Link>
        </div>
      </form>
    </Form>
  );
};
