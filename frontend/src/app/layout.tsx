import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/Header";
import { LocaleProvider } from '@/providers/locale-provider';
import { PublicEnvScript } from "next-runtime-env";
import { HeroUIProvider } from "@/providers/heroui-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Booking System",
  description: "Discover and book amazing venues for your meetings, events, and workspace needs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load default English messages for initial render
  const initialMessages = (await import('@/i18n/messages/en.json')).default;

  return (
    <html lang="en">
      <head>
         <PublicEnvScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeroUIProvider>
          <LocaleProvider initialMessages={initialMessages}>
            <QueryProvider>
              <Header />
              <main>
                {children}
              </main>
            </QueryProvider>
          </LocaleProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
