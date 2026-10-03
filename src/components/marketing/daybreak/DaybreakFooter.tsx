import Link from 'next/link';
import './daybreak.css';

const groups = [
  { title: 'Platform', links: [['Coach Kairos', '/cc'], ['School list', '/schools'], ['Pricing', '/pricing'], ['Interview prep', '/cc/interview-prep']] },
  { title: 'Resources', links: [['About', '/about'], ['FAQ', '/faq'], ['Academic integrity', '/integrity']] },
  { title: 'Legal', links: [['Privacy', '/privacy'], ['Terms', '/terms']] },
];

/** Self-contained styling so the shared footer can adopt this without a Daybreak app shell. */
export default function DaybreakFooter() {
  return <footer className="daybreak db-footer-surface">
    <div className="db-footer db-container">
      <div className="db-footer-intro">
        <Link href="/" className="db-brand" aria-label="KairosLearn home"><img src="/icons/kairos-192.png" width="40" height="40" alt=""/>KairosLearn</Link>
        <p>One good next step,<br/>{' '}in your own words.</p>
        <p>College guidance for students<br/>{' '}and the people beside them.</p>
      </div>
      {groups.map(group => <nav key={group.title} aria-label={group.title}>
        <p className="db-footer-heading">{group.title}</p>
        <ul>{group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
      </nav>)}
    </div>
    <div className="db-footer-note db-container"><p>Your story stays yours. AI can interview, structure and critique. You write every essay.</p></div>
  </footer>;
}
