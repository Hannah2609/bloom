"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/forms/form";
import { Input } from "@/components/ui/forms/input";
import { UploadDropzone, useUploadThing } from "@/lib/uploadthing";
import { companySignupSchema } from "@/lib/validation/validation";
import { Button } from "../../ui/button/button";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading/heading";
import Link from "next/link";

export default function CompanySignupForm() {
  const router = useRouter();
  const [submitStep, setSubmitStep] = useState<
    "idle" | "uploading-logo" | "creating-company"
  >("idle");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const { startUpload, isUploading: isLogoUploading } =
    useUploadThing("imageUploader");
  const form = useForm<z.infer<typeof companySignupSchema>>({
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      companyName: "",
      companyDomain: "",
      logo: undefined,
    },
  });

  const onSubmit = async (formData: z.infer<typeof companySignupSchema>) => {
    setSubmitStep("creating-company");

    try {
      let logoUrl = formData.logo;

      if (logoFile) {
        setSubmitStep("uploading-logo");
        const uploaded = await startUpload([logoFile]);
        if (!uploaded || uploaded.length === 0 || !uploaded[0]?.url) {
          throw new Error("Logo upload failed. Please try again.");
        }

        logoUrl = uploaded[0].url;
        setLogoFile(null);
        setLogoFileName(uploaded[0].name ?? uploaded[0].key ?? null);
        setSubmitStep("creating-company");
      }

      const response = await fetch("/api/auth/company-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          logo: logoUrl,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Company created successfully!");
        form.reset();
        setLogoFile(null);
        setLogoFileName(null);

        // Always redirect to admin signup after company creation
        const redirectUrl =
          data.redirectUrl || `/signup/company/${data.company?.id}`;

        if (redirectUrl) {
          router.push(redirectUrl);
        }
      } else {
        toast.error(data.error || "Failed to create company");
      }
    } catch (error) {
      console.error("Company signup error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create company"
      );
    } finally {
      setSubmitStep("idle");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pt-30 mb-40"
      >
        <div className="space-y-2">
          <Heading level="h3" variant="muted" className="text-lg! font-normal!">
            Company signup
          </Heading>
          <Heading level="h2" className="mb-6 text-2xl font-bold">
            Get started
          </Heading>
          <p className="text-muted-foreground mb-10 max-w-md text-sm">
            Enter your company name and domain to get started. We`ll use this to
            create your company and add you as the first admin.
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

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company logo (optional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value ? (
                    <div className="border-border bg-muted/50 rounded-lg border border-dashed p-4">
                      <p className="text-sm font-normal">Logo uploaded</p>
                      <p className="text-muted-foreground text-xs break-all">
                        {logoFileName ?? field.value}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            field.onChange(undefined);
                            setLogoFile(null);
                            setLogoFileName(null);
                          }}
                        >
                          Remove logo
                        </Button>
                      </div>
                    </div>
                  ) : logoFile ? (
                    <div className="flex items-center justify-between rounded-lg border border-black/50 p-5">
                      <div>
                        <p className="text-sm font-normal">Logo chosen</p>
                        <p className="text-muted-foreground text-xs break-all">
                          {logoFileName ?? logoFile.name}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon-sm"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoFileName(null);
                        }}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="imageUploader"
                      appearance={{
                        container: ({ isDragActive }) =>
                          `border border-dashed rounded-lg  transition-colors duration-200 bg-transparent ${
                            isDragActive
                              ? "border-primary bg-primary/10"
                              : "border-border bg-muted/50"
                          }`,
                        label: "text-sm font-medium",
                        allowedContent: "text-xs text-muted-foreground mt-2",
                        button: "hidden",
                        uploadIcon: "text-muted-foreground",
                      }}
                      config={{ mode: "manual" }}
                      onChange={(files) => {
                        const file = files?.[0];
                        setLogoFile(file ?? null);
                        setLogoFileName(file?.name ?? null);
                        field.onChange(undefined);
                      }}
                    />
                  )}
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <ImageIcon className="h-4 w-4" />
                    Upload your logo image (PNG, JPG, SVG or WEBP up to 4MB)
                  </p>
                </div>
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
            disabled={submitStep !== "idle" || isLogoUploading}
          >
            {submitStep === "uploading-logo" ? (
              <>
                Uploading logo...
                <Loader2Icon className="size-4 animate-spin" />
              </>
            ) : submitStep === "creating-company" ? (
              <>
                Creating your company...
                <Loader2Icon className="size-4 animate-spin" />
              </>
            ) : (
              <>
                Sign up and add yourself as admin
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-center gap-2 text-center text-sm">
          <p>Already have an account?</p>
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
