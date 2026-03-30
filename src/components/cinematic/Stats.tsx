'use client'

const STATS = [
  { value: '69+', label: 'Courses' },
  { value: '17', label: 'Languages' },
  { value: '10', label: 'Career Pathways' },
  { value: '2000+', label: 'Lessons' },
]

export default function Stats() {
  return (
    <div style={{
      margin: '0 24px',
      padding: '80px 0',
      borderTop: '1px solid rgba(242, 237, 227, 0.09)',
      borderBottom: '1px solid rgba(242, 237, 227, 0.09)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
    }}>
      {STATS.map(({ value, label }, i) => (
        <div key={label} style={{
          textAlign: 'center' as const,
          padding: 20,
          borderRight: i < 3 ? '1px solid rgba(242, 237, 227, 0.09)' : 'none',
        }}>
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(52px, 6.5vw, 88px)',
            fontWeight: 300,
            lineHeight: 1,
            color: '#d4a84b',
            display: 'block',
            marginBottom: 12,
          }}>{value}</span>
          <p style={{
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'rgba(242, 237, 227, 0.6)',
          }}>{label}</p>
        </div>
      ))}
    </div>
  )
}
