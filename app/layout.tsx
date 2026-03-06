import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moonext Labour Management System",
  description: "Labour Management System for Moonext Constructions Pvt Ltd"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
            <Link href="/" className="text-sm font-bold tracking-wide text-moonext-navy md:text-base">
              Moonext Constructions Pvt Ltd
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/login" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Login
              </Link>
              <Link href="/dashboard" className="rounded-md bg-moonext-orange px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
