import type { Metadata } from "next";
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
    default: 'KairosLearn — Practice Tech Interviews in Your Language',
    template: '%s | KairosLearn',
  },
  description: 'The only AI interview coach with native voices in 9 languages — English, Spanish, French, German, Italian, Dutch, Japanese, Hindi, Punjabi. Practice the real Google, Meta, Stripe, Anthropic interview loops in the language you think in. $10/mo. Try free.',
  keywords: [
    'AI mock interview', 'interview prep', 'coding interview practice',
    'AI voice tutor', 'learn programming', 'system design interview',
    'behavioral interview practice', 'recruiter screen practice',
    'learn Python', 'learn React', 'data structures algorithms',
    'career pathways', 'AI learning platform', 'voice coaching',
    'multilingual learning', 'learn coding in Spanish',
    'online courses', 'personal finance', 'machine learning',
  ],
  authors: [{ name: 'KairosLearn' }],
  creator: 'KairosLearn',
  publisher: 'KairosLearn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kairoslearn.com',
    siteName: 'KairosLearn',
    title: 'KairosLearn — Practice Tech Interviews in Your Language',
    description: '9 native voice languages. 14 real company interview loops. $10/mo. Try free.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KairosLearn - Practice Tech Interviews in Your Language' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KairosLearn — Practice Tech Interviews in Your Language',
    description: '9 native voice languages. 14 real company interview loops. $10/mo. Try free.',
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
