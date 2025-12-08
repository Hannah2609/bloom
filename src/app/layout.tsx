import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toast/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bloom",
    template: "%s | Bloom",
  },
  description:
    "Bloom is an employee engagement platform that helps organizations measure and improve employee satisfaction, wellbeing, and workplace culture",
  keywords: [
    "employee engagement",
    "employee analytics",
    "workplace culture",
    "wellbeing",
    "feedback",
    "surveys",
  ],
  authors: [{ name: "Hannah Grenade" }, { name: "Katja Krogh" }],
  // OpenGraph metadata for sharing links
  openGraph: {
    title: "Bloom - Employee Engagement Platform",
    description:
      "Measure and improve employee satisfaction, wellbeing, and workplace culture",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#FDFAE0] antialiased dark:bg-black`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
