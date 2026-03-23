import type { Metadata } from "next";
import { Geist_Mono, Lexend, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Court Connect",
  description:
    "Your destination for seamless court bookings and exclusive athletic experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const htmlClassName = [
    "h-full",
    "antialiased",
    manrope.variable,
    lexend.variable,
    geistMono.variable,
    "font-sans",
  ].join(" ");

  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <Toaster position="top-right" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
