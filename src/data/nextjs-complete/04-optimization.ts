import { Module } from "../types";

export const module4: Module = {
  id: "optimization",
  title: "Performance, Images, Fonts & Optimization",
  description: "next/image for automatic optimization, next/font for zero-layout-shift fonts, metadata API, and performance best practices",
  lessons: [
    {
      id: "image-font-optimization",
      slug: "image-font-optimization",
      title: "next/image, next/font & Built-in Optimizations",
      content: `
# Next.js Built-in Optimizations

## next/image

\`\`\`typescript
import Image from 'next/image';

// Local image — size automatically known from import:
import profilePic from './me.jpg';

export function Avatar() {
  return (
    <Image
      src={profilePic}
      alt="Profile picture"
      // width/height auto-inferred from import!
      placeholder="blur"    // blurDataURL auto-generated
      priority              // LCP images: add priority (no lazy loading)
    />
  );
}

// Remote image — must specify width/height:
export function PostCover({ url }: { url: string }) {
  return (
    <Image
      src={url}
      alt="Post cover"
      width={1200}
      height={630}
      sizes="(max-width: 768px) 100vw, 50vw"  // responsive sizes
      className="object-cover"
    />
  );
}

// Fill mode (fills parent container):
<div className="relative h-64 w-full">
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    sizes="100vw"
    className="object-cover"
  />
</div>

// next.config.ts — allow remote images:
// images: { remotePatterns: [{ protocol: 'https', hostname: '**.example.com' }] }

// What next/image does automatically:
// ✓ WebP/AVIF conversion
// ✓ Lazy loading (below fold)
// ✓ Prevents Cumulative Layout Shift (reserves space)
// ✓ On-demand resizing (srcset for different viewports)
// ✓ Caches optimized images on CDN edge
\`\`\`

## next/font

\`\`\`typescript
// app/layout.tsx — Zero layout shift, self-hosted automatically
import { Inter, Roboto_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',          // 'swap' for text visibility during load
  variable: '--font-inter', // CSS custom property for Tailwind
});

const mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

// Custom local font:
const myFont = localFont({
  src: [
    { path: './fonts/MyFont-Regular.woff2', weight: '400' },
    { path: './fonts/MyFont-Bold.woff2', weight: '700' },
  ],
  variable: '--font-custom',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable}\`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
// tailwind.config.ts:
// fontFamily: { sans: ['var(--font-inter)'], mono: ['var(--font-mono)'] }
\`\`\`

## Metadata API

\`\`\`typescript
// Static metadata:
export const metadata = {
  title: 'My App',
  description: 'Description',
  openGraph: {
    title: 'My App',
    description: 'Description',
    images: ['/og-image.jpg'],
  },
  twitter: { card: 'summary_large_image' },
};

// Dynamic metadata with generateMetadata:
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: \`https://mysite.com/blog/\${params.slug}\` },
    openGraph: {
      type: 'article',
      title: post.title,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
  };
}

// app/opengraph-image.tsx — Auto OG image generation:
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return new ImageResponse(
    <div style={{ display: 'flex', fontSize: 48, background: 'black', color: 'white', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      {post.title}
    </div>
  );
}
\`\`\`

## Performance Best Practices

\`\`\`typescript
// 1. Code splitting with dynamic imports:
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // disable SSR for browser-only libraries
});

// 2. Streaming with Suspense for slow components:
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <FastContent />
      <Suspense fallback={<Skeleton />}>
        <SlowDataFetch />
      </Suspense>
    </>
  );
}

// 3. Parallel route fetching:
const [user, posts] = await Promise.all([getUser(), getPosts()]);

// 4. Route prefetching (automatic with <Link>):
import Link from 'next/link';
// Link prefetches the linked page when it enters viewport
<Link href="/about" prefetch={false}>About</Link> // disable if not needed

// 5. next/script for third-party scripts:
import Script from 'next/script';
<Script src="https://analytics.example.com/script.js" strategy="lazyOnload" />
// strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does the 'priority' prop do on next/image?",
      "options": [
        "Loads the image first and disables lazy loading — use for above-the-fold images (LCP)",
        "Increases image quality",
        "Caches the image forever",
        "Converts to WebP"
      ],
      "answer": 0,
      "explanation": "The priority prop preloads the image and disables lazy loading. Use it for your Largest Contentful Paint (LCP) element — typically the hero image or above-the-fold image. Without it, next/image lazy loads by default."
    },
    {
      "q": "What is the main benefit of next/font over linking Google Fonts via <link>?",
      "options": [
        "More fonts available",
        "Fonts are self-hosted at build time — no external request, zero layout shift, privacy-preserving",
        "Better font quality",
        "Works offline"
      ],
      "answer": 1,
      "explanation": "next/font downloads and self-hosts fonts at build time. Benefits: no external network request to Google at runtime (privacy + speed), zero layout shift via automatic font-display:swap and CSS size-adjust, and works without any CDN dependency."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
