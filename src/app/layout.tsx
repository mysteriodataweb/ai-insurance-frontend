import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Insurance Platform",
  description: "AI-powered insurance claims processing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-brand-600">
              AI Insurance
            </a>
            <div className="flex gap-6 text-sm">
              <a href="/submit" className="hover:text-brand-600">Submit Claim</a>
              <a href="/dashboard" className="hover:text-brand-600">Dashboard</a>
              <a href="/analytics" className="hover:text-brand-600">Analytics</a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
