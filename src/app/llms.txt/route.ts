import { NextResponse } from "next/server";
import { ADMISSIONS_SUMMARY } from "@/lib/product-summary";
import { SITE_URL } from "@/lib/seo";

export async function GET() {
  const content = `# KairosLearn

> ${ADMISSIONS_SUMMARY}

## Main pages
- [Home](${SITE_URL}/)
- [Pricing](${SITE_URL}/pricing)
- [For counselors](${SITE_URL}/product/counselor)
- [Essays](${SITE_URL}/product/essays)
- [School list](${SITE_URL}/product/schools)
- [About](${SITE_URL}/about)
- [FAQ](${SITE_URL}/faq)
- [Academic integrity](${SITE_URL}/integrity)

Full detail: ${SITE_URL}/llms-full.txt
`;
  return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
