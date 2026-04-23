import Link from "next/link";
import type { Metadata } from "next";
import { FileText, ArrowRight, Check } from "lucide-react";
import { CSS_PROFILE_GUIDE } from "@/lib/cc/content/css-profile-guide";

export const metadata: Metadata = {
  title: "CSS Profile Guide — KairosLearn",
  description:
    "A plain-English walkthrough of the CSS Profile for international students applying to US colleges. Built for Pakistani, Indian, Nigerian, and other international applicants.",
};

export default function CSSProfileGuidePage() {
  const guide = CSS_PROFILE_GUIDE;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6 text-[#D4AF37]">
          <FileText className="w-6 h-6" />
          <span className="text-xs uppercase tracking-[0.3em]">Financial aid guide</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-white leading-tight mb-6">
          {guide.title}
        </h1>

        <p className="text-base text-white/70 leading-relaxed mb-10">{guide.intro}</p>

        <div className="space-y-10">
          {guide.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-medium text-white mb-3">{section.title}</h2>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>

              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm text-white/80 leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.schools && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {section.schools.map((school) => (
                    <span
                      key={school}
                      className="px-3 py-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-xs text-[#D4AF37]"
                    >
                      {school}
                    </span>
                  ))}
                  <p className="w-full text-xs text-white/40 mt-2">
                    Schools listed use the CSS Profile for international aid applicants. Always confirm on each school&apos;s own financial aid page.
                  </p>
                </div>
              )}
            </section>
          ))}

          <section className="p-5 rounded-lg border border-white/10 bg-white/[0.02]">
            <h2 className="text-base font-medium text-white mb-2">{guide.feeWaiver.title}</h2>
            <p className="text-sm text-white/70 leading-relaxed">{guide.feeWaiver.content}</p>
          </section>
        </div>

        <div className="mt-12 p-6 rounded-lg border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/[0.06] to-transparent">
          <h3 className="text-base font-medium text-white mb-2">
            Want Coach Kairos to walk you through it?
          </h3>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            Ask in chat — say &ldquo;walk me through the CSS Profile&rdquo; and Coach will
            go section by section using your student profile.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cc"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm font-medium hover:bg-[#e3bf4c] transition-colors"
            >
              Open Coach Kairos
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={guide.nextStep.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/80 text-sm font-medium hover:border-white/40 hover:text-white transition-colors"
            >
              {guide.nextStep.label}
            </Link>
          </div>
        </div>

        <p className="mt-12 text-xs text-white/40 leading-relaxed">
          This guide is informational. CSS Profile policies are set by the College Board and individual schools — always verify deadlines and document requirements on the school&apos;s own financial aid page. Schools verify submitted information.
        </p>
      </div>
    </div>
  );
}
