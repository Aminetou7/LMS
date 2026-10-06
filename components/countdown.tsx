'use client'

import { useEffect, useState } from 'react'

const TARGET = new Date('2026-10-23T09:00:00+01:00').getTime()

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const t = now === null ? null : split(TARGET - now)
  const units: [string, number | undefined][] = [
    ['Days', t?.days],
    ['Hours', t?.hours],
    ['Minutes', t?.minutes],
    ['Seconds', t?.seconds],
  ]

  return (
    <div role="timer" aria-live="off" aria-label="Countdown to LMS 2K26" className="flex gap-3 md:gap-5">
      {units.map(([label, value]) => (
        <div
          key={label}
          className="flex w-18 flex-col items-center rounded-lg border border-border bg-card/70 px-2 py-3 backdrop-blur md:w-24 md:py-4"
        >
          <span className="font-display text-4xl tabular-nums leading-none text-foreground md:text-6xl">
            {value === undefined ? '--' : String(value).padStart(2, '0')}
          </span>
          <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
