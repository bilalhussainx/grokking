import Link from 'next/link';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';
import DaybreakFooter from './DaybreakFooter';
import './daybreak.css';

export default function DaybreakShell({ children, languageControl }: { children: ReactNode; languageControl: ReactNode }) {
  preload('/fonts/daybreak/nunito-sans-400-subset.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return <div className="daybreak" data-daybreak-home>
    <a className="db-skip" href="#daybreak-main">Skip to content</a>
    <header className="db-header db-container">
      <Link href="/" className="db-brand" aria-label="KairosLearn home"><img src="/icons/kairos-192.png" width="40" height="40" alt=""/>KairosLearn</Link>
      <nav className="db-header-nav" aria-label="Main"><a href="#how-it-helps">How it helps</a><a href="#family-conversation">For families</a><a href="#plans">Plans</a></nav>
      {languageControl}
      <Link href="/login" className="db-sign-in">Sign in</Link>
      <Link href="/signup" className="db-button db-button--secondary db-create-account">Start free <span aria-hidden="true">↗</span></Link>
    </header>
    {children}
    <DaybreakFooter/>
  </div>;
}
