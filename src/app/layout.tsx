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
  metadataBase: new URL('https://kairos.ai'),
  title: {
    default: 'Kairos.ai — Learn Anything with AI Coaching',
    template: '%s | Kairos.ai',
  },
  description: 'Master coding, philosophy, religion, finance, and more with AI voice coaches. Interactive courses with Python exercises, checkpoint quizzes, and personalized learning paths.',
  keywords: [
    'AI learning platform', 'online courses', 'coding interview preparation',
    'learn Python', 'system design', 'data structures algorithms',
    'philosophy courses', 'Islamic studies', 'Buddhist meditation',
    'Christian theology', 'Stoic philosophy', 'personal finance',
    'investing', 'mental health', 'meditation', 'mindfulness',
    'AI tutor', 'voice coaching', 'interactive learning',
    'cybersecurity course', 'machine learning', 'leadership',
    'geopolitics', 'political strategy',
  ],
  authors: [{ name: 'Kairos.ai' }],
  creator: 'Kairos.ai',
  publisher: 'Kairos.ai',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kairos.ai',
    siteName: 'Kairos.ai',
    title: 'Kairos.ai — Learn Anything with AI Coaching',
    description: 'Master coding, philosophy, religion, finance, and more with AI voice coaches. 60+ interactive courses with personalized learning.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kairos.ai Learning Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kairos.ai — Learn Anything with AI Coaching',
    description: 'Master coding, philosophy, religion, finance, and more with AI voice coaches.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://kairos.ai' },
  verification: {},
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
