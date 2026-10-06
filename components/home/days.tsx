import { CloudLightning, Flame, Package as Parachute } from 'lucide-react'

const days = [
  {
    n: '01',
    date: 'Fri, 23 Oct',
    title: 'The Drop',
    icon: Parachute,
    text: 'Arrival, check-in and opening ceremony. Meet your squad, get your supplies and discover the rules of the arena.',
  },
  {
    n: '02',
    date: 'Sat, 24 Oct',
    title: 'The Storm',
    icon: CloudLightning,
    text: 'Full day of leadership sessions, workshops and team missions. The hardest day — and the one you will talk about the most.',
  },
  {
    n: '03',
    date: 'Sun, 25 Oct',
    title: 'The Survivors',
    icon: Flame,
    text: 'Reflection, recognition and the closing ceremony. Leave with new skills, new friends and the fire to lead.',
  },
]

export function DaysSection() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-24">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">3 days &middot; 3 chapters</p>
        <h2 className="mt-4 font-display text-5xl text-foreground md:text-6xl">The Timeline</h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {days.map((d) => (
            <li
              key={d.n}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary/60"
            >
              <span
                aria-hidden
                className="absolute -right-2 -top-6 font-display text-[8rem] leading-none text-foreground/5 transition-colors group-hover:text-primary/10"
              >
                {d.n}
              </span>
              <d.icon className="size-8 text-primary" aria-hidden />
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Day {d.n} &middot; {d.date}
              </p>
              <h3 className="mt-2 font-display text-4xl text-foreground">{d.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{d.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
