"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImageIcon, XIcon } from "lucide-react";
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
          // Wait a moment for toast to show and session to be saved
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1000);
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

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company logo (optional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value ? (
                    <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4">
                      <p className="text-sm font-normal">Logo uploaded</p>
                      <p className="text-xs text-muted-foreground break-all">
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
                    <div
                      className="rounded-lg border border-black/50 p-5
                    flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-normal">Logo chosen</p>
                        <p className="text-xs text-muted-foreground break-all">
                          {logoFileName ?? logoFile.name}
                        </p>
                      </div>
                      <Button
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
                          ` border border-dashed rounded-lg  transition-colors duration-200 bg-transparent ${
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
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
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
            {submitStep === "uploading-logo"
              ? "Uploading logo..."
              : submitStep === "creating-company"
              ? "Creating company..."
              : "Create company"}
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
