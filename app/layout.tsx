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
    <html lang="en">
      <body className="antialiased">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
