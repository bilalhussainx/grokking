import Link from 'next/link';
import type { ReactNode } from 'react';
import './daybreak.css';

export default function DaybreakShell({ children, languageControl }: { children: ReactNode; languageControl: ReactNode }) {
  return <div className="daybreak">
    <a className="db-skip" href="#daybreak-main">Skip to content</a>
    <header className="db-header db-container">
      <Link href="/" className="db-brand" aria-label="KairosLearn home"><span aria-hidden="true">k</span>KairosLearn</Link>
      <nav className="db-header-nav" aria-label="Main"><a href="#how-it-helps">How it helps</a><a href="#family-conversation">For families</a><a href="#plans">Plans</a></nav>
      {languageControl}
      <Link href="/login" className="db-sign-in">Sign in</Link>
      <Link href="/signup" className="db-button db-button--secondary db-create-account">Start free <span aria-hidden="true">↗</span></Link>
    </header>
    {children}
    <footer className="db-footer db-container">
      <div><Link href="/" className="db-brand"><span aria-hidden="true">k</span>KairosLearn</Link><p>One good next step, in your own words.</p></div>
      <nav aria-label="Footer"><Link href="/pricing">Pricing</Link><Link href="/integrity">Our essay promise</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
    </footer>
  </div>;
}
