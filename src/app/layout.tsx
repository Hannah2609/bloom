import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toast/sonner";
import { Nunito } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SessionProvider } from "@/contexts/SessionContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  style: ["normal", "italic"],
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
      <body className={`${nunito.variable} bg-sidebar font-sans antialiased`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light" //TODO: Change to "system" when bubble background supports dark mode
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
