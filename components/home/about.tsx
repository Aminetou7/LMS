import { BannerImage } from './hero'

const stats = [
  { value: '3', label: 'Days' },
  { value: '14', label: 'Organizers' },
  { value: '1', label: 'Mission' },
]

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24">
      <div className="flex flex-col gap-12 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">The briefing</p>
          <h2 className="mt-4 font-display text-5xl leading-tight text-foreground md:text-6xl text-balance">
            Survive. Lead. Leave a mark.
          </h2>
          <div className="mt-6 flex flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              LMS 2K26 is the Local Members Summit of AIESEC in Hadrumet &mdash; three intense days where
              newbies, oldies and MMB members drop into the same arena to learn, connect and grow as leaders.
            </p>
            <p>
              Expect sessions that challenge you, team missions that push you, nights you won&apos;t forget,
              and a community that has your back when the storm hits. Supplies are dropping. The clock is
              ticking. Will you be there when it hits zero?
            </p>
          </div>

          <dl className="mt-10 flex gap-10">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.label}</dt>
                <dd className="order-1 font-display text-5xl text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex-1">
          <BannerImage />
        </div>
      </div>
    </section>
  )
}
