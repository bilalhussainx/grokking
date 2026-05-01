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
  description: 'Coach Kairos guides first-gen, international, and underprivileged applicants through intake, school list, essays, interviews, and financial aid. $12/mo or free for verified applicants.',
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
    title: 'KairosLearn — Your AI college counselor, for every student',
    description: 'Coach Kairos guides applicants through intake, school list, essays, interviews, and financial aid. $12/mo or free for verified applicants.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KairosLearn — Your AI college counselor, for every student' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KairosLearn — Your AI college counselor, for every student',
    description: 'Coach Kairos guides applicants through intake, school list, essays, interviews, and financial aid. $12/mo or free for verified applicants.',
    images: ['/og-image.png'],
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
