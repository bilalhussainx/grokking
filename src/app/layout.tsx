import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://kairoslearn.com'),
  title: {
    default: 'KairosLearn — AI Interview Coach & Voice Tutor',
    template: '%s | KairosLearn',
  },
  description: 'Practice mock interviews and learn in 17 languages with AI voice coaching. 69+ courses in coding, finance, philosophy, and more. Career pathways for Frontend, Backend, Full Stack, ML/AI, and Data Science.',
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
    title: 'KairosLearn — AI Interview Coach & Voice Tutor',
    description: 'Practice mock interviews and learn in 17 languages with real-time AI voice coaching. 69+ courses, 10 career pathways.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KairosLearn - AI Interview Coach & Voice Tutor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KairosLearn — AI Interview Coach & Voice Tutor',
    description: 'Practice mock interviews and learn in 17 languages with real-time AI voice coaching.',
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
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
