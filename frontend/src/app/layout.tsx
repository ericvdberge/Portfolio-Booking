import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/Header";
import { MobileFooter } from "@/components/MobileFooter";
import { LocaleProvider } from '@/providers/locale-provider';
import { PublicEnvScript } from "next-runtime-env";
import { HeroUIProvider } from "@/providers/heroui-provider";

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
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
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
        className="antialiased"
      >
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
