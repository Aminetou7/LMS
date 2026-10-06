'use client'

import { useState } from 'react'
import { Package, Sprout, Shield, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Position } from '@/lib/registration-schema'

const options: { id: Position; label: string; desc: string; icon: typeof Sprout }[] = [
  { id: 'newbie', label: 'Newbie', desc: 'First season in AIESEC', icon: Sprout },
  { id: 'oldie', label: 'Oldie', desc: 'Been through a few storms', icon: Shield },
  { id: 'mmb', label: 'MMB', desc: 'Management board member', icon: Crown },
]

export function PositionDrop({
  value,
  onChange,
  error,
}: {
  value: Position | ''
  onChange: (p: Position | '') => void
  error?: string
}) {
  const [over, setOver] = useState(false)
  const [dragging, setDragging] = useState<Position | null>(null)
  const selected = options.find((o) => o.id === value)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Drag your badge into the supply crate &mdash; or just tap it.
      </p>

      <ul className="grid grid-cols-3 gap-3" aria-label="Positions">
        {options.map((o) => {
          const isSelected = o.id === value
          return (
            <li key={o.id}>
              <button
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', o.id)
                  e.dataTransfer.effectAllowed = 'move'
                  setDragging(o.id)
                }}
                onDragEnd={() => setDragging(null)}
                onClick={() => onChange(o.id)}
                aria-pressed={isSelected}
                className={cn(
                  'flex w-full cursor-grab flex-col items-center gap-2 rounded-lg border border-border bg-background/60 p-4 text-center transition-all hover:-translate-y-1 hover:border-primary/60 active:cursor-grabbing',
                  isSelected && 'opacity-40',
                  dragging === o.id && 'scale-95 opacity-60',
                )}
              >
                <o.icon className="size-7 text-primary" aria-hidden />
                <span className="font-display text-2xl text-foreground">{o.label}</span>
                <span className="hidden text-xs text-muted-foreground sm:block">{o.desc}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          const id = e.dataTransfer.getData('text/plain') as Position
          if (options.some((o) => o.id === id)) onChange(id)
        }}
        aria-live="polite"
        className={cn(
          'flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-center transition-all',
          over && 'scale-[1.02] border-primary bg-primary/10',
          selected && 'border-solid border-primary/70 bg-primary/5',
          error && !selected && 'border-destructive',
        )}
      >
        {selected ? (
          <>
            <selected.icon className="size-10 animate-in zoom-in text-primary" aria-hidden />
            <p className="font-display text-4xl text-foreground">{selected.label}</p>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Change
            </button>
          </>
        ) : (
          <>
            <Package className={cn('size-10 text-muted-foreground transition-transform', over && 'scale-125 text-primary')} aria-hidden />
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Drop zone</p>
          </>
        )}
      </div>
      {error && !selected && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
