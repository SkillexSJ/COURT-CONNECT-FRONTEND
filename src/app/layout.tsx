import type { Metadata } from "next";
import { Geist_Mono, Lexend, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { ChatAssistant } from "@/components/shared/ChatAssistant";

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
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const htmlClassName = [
    "antialiased",
    manrope.variable,
    lexend.variable,
    geistMono.variable,
    "font-sans",
  ].join(" ");

  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <Toaster position="top-left" />
          {children}
          <ChatAssistant />
        </QueryProvider>
      </body>
    </html>
  );
}
