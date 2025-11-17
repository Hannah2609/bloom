"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
// import { PasswordInput } from "@/components/ui/forms/password-input";
import { Button } from "../../ui/button/button";
import { useForm } from "react-hook-form";
import { companySignupSchema } from "@/lib/validation/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

export default function CompanySignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof companySignupSchema>>({
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      companyName: "",
      companyDomain: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof companySignupSchema>) => {
    setIsSubmitting(true);

    const response = await fetch("/api/auth/company-signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (response.ok) {
      console.log("Company created:", data);
      // router.push("/signup/profile"); TODO
      toast.success("Company created successfully!");
      form.reset();
    } else {
      toast.error(data.error || "Failed to create company");
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Company signup</h1>
          <p className="text-muted-foreground text-sm">
            Enter your company info to get started
          </p>
        </div>

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Bloom"
                  autoComplete="company-name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyDomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company domain</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="bloom.com"
                  autoComplete="company-domain"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating company..." : "Create company"}
          </Button>
        </div>

        <div className="text-center text-sm flex gap-2 justify-center">
          <p>Already have an accaount?</p>
          <a href="/login" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </form>
    </Form>
  );
}
