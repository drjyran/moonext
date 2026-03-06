import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moonext LMS",
  description: "Labour Management System for Moonext Constructions Pvt Ltd"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
