import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { PageErrorBoundary } from "@/components/ui/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naratia - Collaborative Storytelling Platform",
  description: "Build stories together, paragraph by paragraph. A gamified platform for collaborative creative writing.",
  keywords: ["storytelling", "collaborative writing", "creative writing", "stories", "community"],
  authors: [{ name: "Naratia Team" }],
  creator: "Naratia",
  publisher: "Naratia",
  openGraph: {
    title: "Naratia - Collaborative Storytelling Platform",
    description: "Build stories together, paragraph by paragraph. A gamified platform for collaborative creative writing.",
    url: "https://naratia.com",
    siteName: "Naratia",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naratia - Collaborative Storytelling Platform",
    description: "Build stories together, paragraph by paragraph. A gamified platform for collaborative creative writing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageErrorBoundary>
          <QueryProvider>
            {children}
          </QueryProvider>
        </PageErrorBoundary>
      </body>
    </html>
  );
}
