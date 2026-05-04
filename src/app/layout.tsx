import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/schema";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kairoslearn.com'),
  title: {
    default: 'KairosLearn — Your AI college counselor, for every student',
    template: '%s | KairosLearn',
  },
  description: 'KairosLearn is an AI admissions counselor that knows your essays, understands your finances, and will take your call at 11pm the night before a deadline. The college counselor that wealthy families pay $8,000 for — now free for everyone else.',
  keywords: [
    'AI college counselor', 'college admissions', 'college application help',
    'personal statement coach', 'common app essay coach', 'supplemental essay help',
    'school list builder', 'reach match safety', 'chancing calculator',
    'college interview prep', 'Ivy League interview practice',
    'first generation college student', 'international student admissions',
    'financial aid guidance', 'activities optimizer', 'recommendation letter coach',
    'AI admissions advisor', 'private college counseling alternative',
  ],
  authors: [{ name: 'KairosLearn' }],
  creator: 'KairosLearn',
  publisher: 'KairosLearn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kairoslearn.com',
    siteName: 'KairosLearn',
    title: 'KairosLearn — The AI college counselor wealthy families pay $8,000 for. Now free for everyone else.',
    description: 'AI admissions counseling that knows your essays, understands your finances, and takes your call at 11pm the night before a deadline.',
    // og:image is auto-generated from src/app/opengraph-image.tsx (1200x630).
    // Don't add an explicit `images` here — Next.js will inject the file-based
    // route into <meta property="og:image"> automatically.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KairosLearn — The AI college counselor wealthy families pay $8,000 for.',
    description: 'AI admissions counseling that knows your essays, understands your finances, and takes your call at 11pm the night before a deadline.',
    // twitter:image is auto-generated from src/app/twitter-image.tsx (or
    // falls back to opengraph-image when only the OG variant exists).
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://kairoslearn.com' },
  verification: {
    google: 'KNMPohxROF74CLkjabDN0V0iiaeRPJ9WvQIObQik8HA',
  },
};

// Without an explicit viewport export, Next.js App Router does NOT emit a
// viewport meta tag — mobile browsers default to desktop width (980px) and
// scale-shrink the page. Setting it explicitly fixes the "everything looks
// tiny on mobile" rendering across the whole site.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Allow zoom — accessibility (don't lock to 1.0).
  maximumScale: 5,
  themeColor: "#05080d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
