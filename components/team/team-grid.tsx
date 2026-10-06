'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { team, type TeamMember } from '@/lib/team'

const departments = ['All', ...Array.from(new Set(team.map((m) => m.department)))] as const

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
}

export function TeamGrid() {
  const [filter, setFilter] = useState<string>('All')
  const visible = filter === 'All' ? team : team.filter((m) => m.department === filter)

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter by department" className="flex flex-wrap gap-2">
        {departments.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={filter === d}
            onClick={() => setFilter(d)}
            className={cn(
              'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors',
              filter === d
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:border-primary/60 hover:text-foreground',
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i} />
        ))}
      </ul>
    </div>
  )
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const lead = member.department === 'Leadership'
  return (
    <li
      className="group flex flex-col items-center rounded-xl border border-border bg-card/60 p-6 text-center transition-all animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1 hover:border-primary/60"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
    >
      <div className="relative">
        <div
          aria-hidden
          className={cn(
            'absolute -inset-2 rounded-full border-2 border-dashed border-foreground/20 transition-transform duration-700 group-hover:rotate-180',
            lead && 'border-primary/60',
          )}
        />
        <div
          className={cn(
            'flex size-20 items-center justify-center rounded-full bg-accent font-display text-3xl text-foreground md:size-24 md:text-4xl',
            lead && 'bg-primary text-primary-foreground',
          )}
        >
          {initials(member.name)}
        </div>
      </div>
      <h2 className="mt-6 font-display text-2xl leading-tight text-foreground">{member.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground text-balance">{member.role}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-primary">{member.department}</p>
    </li>
  )
}
