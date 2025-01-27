import type { Metadata } from "next";
import { Noto_Sans_TC as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const fontSans = FontSans({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weekly UI",
  description: "A website that allows you to enjoy weekly news.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar">
      <body
        className={cn(
          "min-h-screen max-h-screen bg-background antialiased",
          process.env.NODE_ENV === "production"
            ? fontSans.className
            : "font-noto"
        )}
      >
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
