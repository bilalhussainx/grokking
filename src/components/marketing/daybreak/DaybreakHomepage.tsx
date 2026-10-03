'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Select } from '@/components/ui/daybreak';
import { PRICING, PRO_FAIR_USE, TRIAL_TERMS } from "@/lib/pricing";
import { QUICK_CHECK_COPY, QUICK_CHECK_LANGUAGES, type QuickCheckLanguage } from '@/lib/daybreak';
import DaybreakShell from './DaybreakShell';
import NextStepCheck from './NextStepCheck';
import CostCheck from './CostCheck';

const eyebrow = {en:'College guidance, at your pace',es:'Orientación universitaria, a tu ritmo',hi:'कॉलेज का मार्गदर्शन, आपकी गति से',pa:'ਕਾਲਜ ਦੀ ਅਗਵਾਈ, ਤੁਹਾਡੀ ਰਫ਼ਤਾਰ ਨਾਲ',ur:'کالج کی رہنمائی، آپ کی رفتار سے'};

export default function DaybreakHomepage() {
  const [language,setLanguage]=useState<QuickCheckLanguage>('en');
  const [familyOpen,setFamilyOpen]=useState(false);
  const copy=QUICK_CHECK_COPY[language];
  return <DaybreakShell languageControl={<div className="db-language"><Select id="quick-check-language" label="Quick check language" value={language} onChange={e=>setLanguage(e.target.value as QuickCheckLanguage)}>{QUICK_CHECK_LANGUAGES.map(lang=><option key={lang.code} value={lang.code}>{lang.nativeName}</option>)}</Select></div>}>
    <main id="daybreak-main" className="db-container" tabIndex={-1}>
      <section className="db-hero" aria-labelledby="daybreak-title">
        <div className="db-hero-intro" lang={language} dir={language==='ur'?'rtl':'ltr'}><p className="db-eyebrow">{eyebrow[language]}</p><h1 id="daybreak-title">{language==='en'?<>Your future.<br/>One good <em>next step.</em></>:copy.headline}</h1><p className="db-hero-lead">{copy.intro}</p></div>
        <figure className="db-hero-art"><img src="/illustrations/daybreak/next-step.svg" width="520" height="240" alt=""/><figcaption>There is more than one way forward.</figcaption></figure>
        <NextStepCheck language={language}/>
      </section>
      <section className="db-welcome" aria-label="A welcome across languages"><div className="db-welcome-label"><span className="db-tile-mark" aria-hidden="true"><i/><i/><i/></span><p>A little more at home.<br/><span>English, Español, हिन्दी, ਪੰਜਾਬੀ, اردو.</span></p></div><p lang="hi">आपका स्वागत है</p><p lang="pa">ਜੀ ਆਇਆਂ ਨੂੰ</p><p lang="ur" dir="rtl">خوش آمدید</p></section>
      <section id="how-it-helps" className="db-section" aria-labelledby="how-title"><div className="db-section-intro"><p className="db-eyebrow">You bring the life. We help with the next step.</p><h2 id="how-title">Big questions become<br/>smaller things to do.</h2></div><div className="db-story-rows">
        <article><span className="db-step-number">01</span><h3>Start with your reality.</h3><p>Grade 9, a senior year, or a fresh start at another college. Begin with the question you have today.</p></article>
        <article><span className="db-step-number">02</span><h3>Make the unknown visible.</h3><p>School requirements, costs, a blank essay page. Name what you need to understand before deciding.</p></article>
        <article><span className="db-step-number">03</span><h3>Keep your own voice.</h3><p>Talk through your experiences. Find a structure. Get feedback. The words in your essay are yours to write.</p><Link href="/integrity">Read our essay promise <span aria-hidden="true">↗</span></Link></article>
      </div></section>
      <section id="family-conversation" className="db-family db-card db-card--sage" aria-labelledby="family-title"><div><p className="db-eyebrow">There is room for your family here.</p><h2 id="family-title">A conversation everyone<br/>can be part of.</h2><p>You don’t have to explain the whole college process on your own. Bring a parent or someone you trust into a conversation about cost and what matters to you.</p><Button variant="secondary" aria-expanded={familyOpen} aria-controls="family-guide" onClick={()=>setFamilyOpen(!familyOpen)}>{familyOpen?'Close the conversation guide':'Start a family conversation'}<span aria-hidden="true">{familyOpen?'−':'+'}</span></Button></div>
        <div className="db-family-note"><p className="db-eyebrow">One question to start with</p><p className="db-family-question">“What would make college feel workable for our family?”</p><p className="db-small">It is okay not to know yet.</p></div>
        <div id="family-guide" className="db-family-guide" hidden={!familyOpen}><h3>Three questions to ask together</h3><ol><li>What matters most to us about college?</li><li>What could we contribute each year, and what is still unknown?</li><li>Which question should we take to the school?</li></ol><p>Family mode in KairosLearn offers a place to talk through aid questions. This quick conversation guide stays on this page.</p></div>
      </section>
      <CostCheck/>
      <section id="plans" className="db-section db-plans" aria-labelledby="plans-title"><div className="db-section-intro"><p className="db-eyebrow">Start with room to explore</p><h2 id="plans-title">Clear plans. No pressure.</h2></div><div className="db-plan-grid">
        <article className="db-card"><p className="db-eyebrow">Free</p><h3 className="db-price">Free</h3><p>{PRICING.free.signupCredits} credits, once at signup.</p><ul><li>Try the AI tools at your own pace.</li><li>Credits do not renew monthly.</li></ul><Link href="/signup" className="db-button db-button--secondary">Start free <span aria-hidden="true">↗</span></Link></article>
        <article className="db-card db-pro-plan"><p className="db-eyebrow">Pro</p><h3 className="db-price">${PRICING.pro.monthlyUsd}<span>/month USD</span></h3><p>Or ${PRICING.pro.yearlyUsd}/year USD.</p><ul><li>{TRIAL_TERMS}</li><li>Fair use: up to {PRO_FAIR_USE.coachMessagesPerDay} coach messages and {PRO_FAIR_USE.voiceMinutesPerDay} voice minutes a day.</li><li>Pro usage does not spend credits.</li></ul><Link href="/pricing" className="db-button db-button--secondary">Explore Pro <span aria-hidden="true">↗</span></Link></article>
      </div><p className="db-small">Plans cover AI tools. Human counselor services are separate. AI interviews, structures and critiques; you write every essay.</p></section>
      <section className="db-closing"><p className="db-eyebrow">A little progress is enough.</p><h2>You can begin with<br/>the question you have.</h2><a href="#next-step-title" className="db-button db-button--primary">Find my next step <span aria-hidden="true">↑</span></a></section>
    </main>
  </DaybreakShell>;
}
