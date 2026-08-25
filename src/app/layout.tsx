import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI Insurance Platform",
  description: "AI-powered insurance claims processing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="lg:ml-64 min-h-screen">
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
