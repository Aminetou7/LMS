import { Package } from 'lucide-react'

const drops = [
  { left: '8%', delay: '0s', size: 'size-6' },
  { left: '82%', delay: '-8s', size: 'size-5' },
  { left: '64%', delay: '-15s', size: 'size-4' },
]

export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-flicker bg-foreground/40 mix-blend-overlay" />
      {drops.map((d) => (
        <div
          key={d.left}
          className="absolute top-0 flex animate-drift flex-col items-center text-foreground/50"
          style={{ left: d.left, animationDelay: d.delay }}
        >
          <svg viewBox="0 0 40 24" className="h-6 w-10 fill-current">
            <path d="M0 14 Q20 -8 40 14 Q30 10 20 14 Q10 10 0 14Z" />
            <path d="M2 14 L18 22 M38 14 L22 22 M20 14 L20 22" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          <Package className={d.size} />
        </div>
      ))}
    </div>
  )
}
