import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://prabowo.me'),
  title: {
    default: 'PrabowoSawit - Nonton Anime Subtitle Indonesia Gratis',
    template: '%s | PrabowoSawit'
  },
  description: 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis. Streaming anime ongoing, completed, dan batch download dengan kualitas HD.',
  keywords: [
    'anime',
    'nonton anime',
    'anime subtitle indonesia',
    'anime sub indo',
    'streaming anime',
    'download anime',
    'anime gratis',
    'anime terbaru',
    'anime ongoing',
    'anime completed',
    'batch anime',
    'prabowosawit'
  ],
  authors: [{ name: 'PrabowoSawit' }],
  creator: 'PrabowoSawit',
  publisher: 'PrabowoSawit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://prabowo.me',
    siteName: 'PrabowoSawit',
    title: 'PrabowoSawit - Nonton Anime Subtitle Indonesia Gratis',
    description: 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis. Streaming anime ongoing, completed, dan batch download dengan kualitas HD.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PrabowoSawit - Nonton Anime Sub Indo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrabowoSawit - Nonton Anime Subtitle Indonesia Gratis',
    description: 'Nonton anime subtitle Indonesia terbaru dan terlengkap secara gratis.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://prabowo.me" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-slate-950 text-white antialiased`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}