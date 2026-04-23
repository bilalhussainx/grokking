'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      style={{
        padding: '100px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {children}
    </motion.section>
  )
}

function EyebrowHeadline({
  eyebrow,
  headline,
  highlight,
}: {
  eyebrow: string
  headline: string
  highlight?: string
}) {
  return (
    <>
      <p
        style={{
          textAlign: 'center',
          fontSize: 11,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#d4a84b',
          marginBottom: 14,
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(30px, 4.6vw, 48px)',
          fontWeight: 300,
          marginBottom: 50,
          color: '#f2ede3',
          lineHeight: 1.15,
          maxWidth: 860,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {headline}{' '}
        {highlight && (
          <em style={{ fontStyle: 'italic', color: '#d4a84b' }}>{highlight}</em>
        )}
      </h2>
    </>
  )
}

function BeforeAfterCard({
  before,
  after,
}: {
  before: { title: string; body: string }
  after: { title: string; body: string }
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          padding: '36px 32px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(242, 237, 227, 0.08)',
          borderRadius: 6,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(242, 237, 227, 0.35)',
            marginBottom: 16,
          }}
        >
          {before.title}
        </p>
        <p
          style={{
            fontSize: 15,
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(242, 237, 227, 0.55)',
            whiteSpace: 'pre-line',
          }}
        >
          {before.body}
        </p>
      </div>
      <div
        style={{
          padding: '36px 32px',
          background: 'rgba(212, 168, 75, 0.04)',
          border: '1px solid rgba(212, 168, 75, 0.22)',
          borderRadius: 6,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#d4a84b',
            marginBottom: 16,
          }}
        >
          {after.title}
        </p>
        <p
          style={{
            fontSize: 15,
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(242, 237, 227, 0.85)',
            whiteSpace: 'pre-line',
          }}
        >
          {after.body}
        </p>
      </div>
    </div>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto', maxWidth: 720 }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            padding: '12px 0',
            borderBottom: '1px solid rgba(242, 237, 227, 0.06)',
            fontSize: 15,
            color: 'rgba(242, 237, 227, 0.85)',
            fontWeight: 300,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color: '#d4a84b',
              fontSize: 14,
              lineHeight: '1.7',
              flexShrink: 0,
            }}
          >
            ◆
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function PipelineFlow() {
  const stages = [
    'Intake',
    'School List',
    'Essays',
    'Activities',
    'Interview Prep',
    'Financial Aid',
  ]
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 28,
      }}
    >
      {stages.map((stage, i) => (
        <div
          key={stage}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              padding: '10px 18px',
              background: 'rgba(212, 168, 75, 0.08)',
              border: '1px solid rgba(212, 168, 75, 0.3)',
              borderRadius: 999,
              fontSize: 13,
              color: '#f2ede3',
              letterSpacing: '0.02em',
            }}
          >
            {stage}
          </span>
          {i < stages.length - 1 && (
            <span aria-hidden="true" style={{ color: 'rgba(212, 168, 75, 0.4)' }}>
              →
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function PricingTable() {
  const rows = [
    { label: 'Monthly cost', school: '$0 (taxpayer funded)', private: '$8,000+', kairos: '$10' },
    { label: 'Students served', school: '400 per counselor', private: '1 to 1', kairos: 'Unlimited access' },
    { label: 'Available at 11pm', school: 'No', private: 'No', kairos: 'Yes' },
    { label: 'Reads every essay draft', school: 'No', private: 'Sometimes', kairos: 'Always' },
    { label: 'Hindi / Punjabi / Urdu', school: 'Rarely', private: 'Rarely', kairos: 'Yes' },
    { label: 'Mock interviews', school: 'No', private: 'Sometimes', kairos: 'Unlimited, 10 personas' },
    { label: 'FAFSA & CSS Profile help', school: 'Limited', private: 'Yes', kairos: 'Yes, with walkthrough' },
    { label: 'Financial aid appeal letters', school: 'No', private: 'Yes', kairos: 'Yes, drafted for you' },
  ]
  return (
    <div
      style={{
        maxWidth: 960,
        margin: '0 auto',
        overflowX: 'auto',
        border: '1px solid rgba(242, 237, 227, 0.08)',
        borderRadius: 6,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
          color: '#f2ede3',
          minWidth: 640,
        }}
      >
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
            <th
              style={{
                textAlign: 'left',
                padding: '18px 20px',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(242, 237, 227, 0.5)',
              }}
            />
            <th
              style={{
                padding: '18px 20px',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(242, 237, 227, 0.5)',
                textAlign: 'left',
              }}
            >
              School counselor
            </th>
            <th
              style={{
                padding: '18px 20px',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(242, 237, 227, 0.5)',
                textAlign: 'left',
              }}
            >
              Private counselor
            </th>
            <th
              style={{
                padding: '18px 20px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#d4a84b',
                textAlign: 'left',
              }}
            >
              KairosLearn Pro
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              style={{
                borderTop: '1px solid rgba(242, 237, 227, 0.06)',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
              }}
            >
              <td style={{ padding: '14px 20px', fontWeight: 400, color: 'rgba(242, 237, 227, 0.75)' }}>
                {row.label}
              </td>
              <td style={{ padding: '14px 20px', color: 'rgba(242, 237, 227, 0.55)', fontWeight: 300 }}>
                {row.school}
              </td>
              <td style={{ padding: '14px 20px', color: 'rgba(242, 237, 227, 0.55)', fontWeight: 300 }}>
                {row.private}
              </td>
              <td style={{ padding: '14px 20px', color: '#f2ede3', fontWeight: 400 }}>
                {row.kairos}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Features() {
  return (
    <div id="features">
      {/* SECTION 1 — The counselor that never sleeps */}
      <Section>
        <EyebrowHeadline
          eyebrow="ALWAYS ON"
          headline="The counselor that"
          highlight="never sleeps."
        />
        <BeforeAfterCard
          before={{
            title: 'Before KairosLearn',
            body: `It's 11pm. Your CommonApp essay is due tomorrow.
Your school counselor isn't answering.
Your parents can't help — they never went to college.
You're alone with a blank page.`,
          }}
          after={{
            title: 'After KairosLearn',
            body: `Coach Kairos knows your story. It helped you brainstorm your essay three weeks ago. It knows you play violin, started a coding club, and that MIT is your reach.
It's ready right now.
And it speaks Hindi, Punjabi, and Urdu.`,
          }}
        />
      </Section>

      {/* SECTION 2 — Built for the student everyone forgot */}
      <Section>
        <EyebrowHeadline
          eyebrow="BUILT FOR YOU"
          headline="Built for the student"
          highlight="everyone forgot."
        />
        <div style={{ maxWidth: 760, margin: '0 auto 32px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: 'rgba(242, 237, 227, 0.72)',
              fontWeight: 300,
              marginBottom: 16,
            }}
          >
            The $8,000 college counselor is for the kid whose parents went to Yale.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: 'rgba(242, 237, 227, 0.72)',
              fontWeight: 300,
              marginBottom: 16,
            }}
          >
            You are a first-generation applicant from Pakistan whose 87% GPA has
            never once appeared correctly in an American school list builder.
          </p>
          <p
            style={{
              fontSize: 20,
              lineHeight: 1.6,
              color: '#f2ede3',
              fontWeight: 400,
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              marginBottom: 32,
            }}
          >
            We built KairosLearn for you.
          </p>
        </div>
        <CheckList
          items={[
            'Pakistani percentage GPA → 4.0 scale, automatically',
            'Need-blind schools for international students, filtered',
            '$0 / I need full financial aid — we understand what that means',
            'Voice counseling in Hindi and Punjabi',
          ]}
        />
      </Section>

      {/* SECTION 3 — The full application, in one place */}
      <Section>
        <EyebrowHeadline
          eyebrow="ONE PLATFORM, EVERY STAGE"
          headline="The full application —"
          highlight="in one place."
        />
        <PipelineFlow />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: 'rgba(242, 237, 227, 0.72)',
              fontWeight: 300,
            }}
          >
            Not a chatbot. A complete application workflow. From &ldquo;where
            should I even apply?&rdquo; to &ldquo;how do I compare these two
            financial aid offers?&rdquo; — in one product.
          </p>
        </div>
      </Section>

      {/* SECTION 4 — $10/month */}
      <Section>
        <EyebrowHeadline
          eyebrow="PRICING"
          headline="What $10 a month"
          highlight="buys you."
        />
        <div style={{ maxWidth: 760, margin: '0 auto 40px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: 'rgba(242, 237, 227, 0.72)',
              fontWeight: 300,
              marginBottom: 10,
            }}
          >
            A private college counselor costs $8,000. A good one costs $50,000.
          </p>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: 'rgba(242, 237, 227, 0.72)',
              fontWeight: 300,
              marginBottom: 24,
            }}
          >
            For students who need full financial aid, neither is an option.
          </p>
          <p
            style={{
              fontSize: 20,
              lineHeight: 1.6,
              color: '#f2ede3',
              fontWeight: 400,
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
            }}
          >
            KairosLearn Pro: $10/month. All the tools a $50,000 counselor would use.
          </p>
        </div>
        <PricingTable />
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 30px',
              background: '#d4a84b',
              color: '#05080d',
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              borderRadius: 4,
            }}
          >
            See pricing
          </Link>
        </div>
      </Section>
    </div>
  )
}
