import type { Metadata } from "next";
import "./globals.css";
import { DashboardShell } from "@/components/layout/DashboardShell";

export const metadata: Metadata = {
  title: "NoirVision",
  description: "Local AI dashboard for LLM and ComfyUI workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
