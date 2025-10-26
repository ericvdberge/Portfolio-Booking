import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/Header";
import { MobileFooter } from "@/components/MobileFooter";
import { LocaleProvider } from '@/providers/locale-provider';
import { PublicEnvScript } from "next-runtime-env";
import { HeroUIProvider } from "@/providers/heroui-provider";
import { PWAInstaller } from "@/components/PWAInstaller";

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
  applicationName: "Portfolio Booking",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Booking",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/IMG_4255.png", sizes: "1024x1536", type: "image/png" },
      { url: "/icons/IMG_4255.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/IMG_4255.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/IMG_4255.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0070f3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
        <PWAInstaller />
        <HeroUIProvider>
          <LocaleProvider initialMessages={initialMessages}>
            <QueryProvider>
              <Header />
              <main className="pb-16 md:pb-0">
                {children}
              </main>
              <MobileFooter />
            </QueryProvider>
          </LocaleProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
