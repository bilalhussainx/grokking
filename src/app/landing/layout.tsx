import type { ReactNode } from 'react'

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="kl-surface-landing">
      {children}
    </div>
  )
}
