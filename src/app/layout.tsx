import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI Insurance Platform",
  description: "AI-powered insurance claims processing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f8fafc] min-h-screen">
        <Sidebar />
        <div className="lg:ml-[260px] min-h-screen">
          <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">{children}</main>
        </div>
      </body>
    </html>
  );
}