// Generates schema.org JSON-LD for the site

const BASE_URL = 'https://kairoslearn.com';

// Organization schema (used on every page)
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KairosLearn',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'AI college counselor for every student — intake, school list, essays, interviews, and financial aid.',
    sameAs: [],
  };
}

// WebSite schema (no site search: the course catalogue is retired)
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KairosLearn',
    url: BASE_URL,
  };
}

// BreadcrumbList schema
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ schema (for course pages that have checkpoint questions)
export function faqSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}

// Helper to render JSON-LD as script tag
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
