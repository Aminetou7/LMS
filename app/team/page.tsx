import type { Metadata } from 'next'
import { TeamGrid } from '@/components/team/team-grid'

export const metadata: Metadata = {
  title: 'The Team — LMS 2K26',
  description: 'Meet the 14 members of the organizing committee behind LMS 2K26 by AIESEC in Hadrumet.',
}

export default function TeamPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-primary">Organizing committee</p>
      <h1 className="mt-3 font-display text-5xl text-foreground md:text-7xl text-balance">
        The 14 who keep the clock ticking
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Behind every session, every supply drop and every late-night surprise is this crew. Say hi when you
        see them &mdash; they&apos;ve been building LMS 2K26 for months.
      </p>
      <div className="mt-12">
        <TeamGrid />
      </div>
    </main>
  )
}
