import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { LocaleProvider } from '@/providers/locale-provider';
import { PublicEnvScript } from "next-runtime-env";
import { HeroUIProvider } from "@/providers/heroui-provider";
import { OrganizationProvider } from "@/contexts/OrganizationContext";

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
  maximumScale: 1,
  userScalable: false,
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
            <OrganizationProvider>
              <QueryProvider>
                {children}
              </QueryProvider>
            </OrganizationProvider>
          </LocaleProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
