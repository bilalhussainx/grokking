import { NextResponse } from "next/server";
import { ADMISSIONS_SUMMARY } from "@/lib/product-summary";

export async function GET() {
  const content = `# KairosLearn

> ${ADMISSIONS_SUMMARY}

## Main pages
- [Home](https://kairoslearn.com/)
- [Pricing](https://kairoslearn.com/pricing)
- [For counselors](https://kairoslearn.com/product/counselor)
- [Essays](https://kairoslearn.com/product/essays)
- [School list](https://kairoslearn.com/product/schools)
- [Find a counselor](https://kairoslearn.com/find-counselor)
- [About](https://kairoslearn.com/about)
- [FAQ](https://kairoslearn.com/faq)
- [Academic integrity](https://kairoslearn.com/integrity)

Full detail: https://kairoslearn.com/llms-full.txt
`;
  return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
