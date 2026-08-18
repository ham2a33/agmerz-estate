import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGMERZ ESTATE",
  description: "Premium real estate agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
