import { NextResponse } from "next/server";
import { ADMISSIONS_SUMMARY } from "@/lib/product-summary";
import { FAQ_ITEMS } from "@/lib/faq-items";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";
import { PRICING, proMonthlyLabel, proYearlyLabel } from "@/lib/pricing";

export async function GET() {
  const languages = COACH_LANGUAGES.map((l) => l.name).join(", ");
  const faq = FAQ_ITEMS.map((i) => `### ${i.question}\n${i.answer}`).join("\n\n");
  const content = `# KairosLearn

> ${ADMISSIONS_SUMMARY}

## Plans
- Free: ${PRICING.free.signupCredits} credits once, at signup.
- Pro: ${proMonthlyLabel()} or ${proYearlyLabel()}, unlimited under fair use, with a ${PRICING.pro.trialDays}-day free trial.

## Coach languages
${languages}

## Questions and answers

${faq}

## Pages
- https://kairoslearn.com/pricing
- https://kairoslearn.com/product/counselor
- https://kairoslearn.com/product/essays
- https://kairoslearn.com/product/schools
- https://kairoslearn.com/faq
- https://kairoslearn.com/integrity
`;
  return new NextResponse(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
