import { SITE_URL } from "@/lib/seo";
import { NextResponse } from "next/server";
import { ADMISSIONS_SUMMARY } from "@/lib/product-summary";
import { FAQ_ITEMS } from "@/lib/faq-items";
import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";
import { PRICING, proMonthlyLabel, proYearlyLabel } from "@/lib/pricing";

export async function GET() {
  const faq = FAQ_ITEMS.map((i) => `### ${i.question}\n${i.answer}`).join("\n\n");
  const content = `# KairosLearn

> ${ADMISSIONS_SUMMARY}

## Plans
- Free: ${PRICING.free.signupCredits} credits once, at signup.
- Pro: ${proMonthlyLabel()} or ${proYearlyLabel()}, unlimited under fair use, with a ${PRICING.pro.trialDays}-day free trial.

## Coach languages
Coach Kairos speaks ${COACH_LANGUAGE_COUNT} languages, including English, Spanish, Hindi, Punjabi and Urdu.

## Questions and answers

${faq}

## Pages
- ${SITE_URL}/pricing
- ${SITE_URL}/product/counselor
- ${SITE_URL}/product/essays
- ${SITE_URL}/product/schools
- ${SITE_URL}/faq
- ${SITE_URL}/integrity
`;
  return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
