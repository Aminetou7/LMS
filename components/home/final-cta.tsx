import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h2 className="font-display text-5xl text-foreground md:text-7xl text-balance">
        Spots are limited. Time isn&apos;t on your side.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Registration takes about 3 minutes. Have your picture, letter of intent and CV links ready.
      </p>
      <Link
        href="/register"
        className="group mt-10 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105"
      >
        Register now
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>

      <div className="mx-auto mt-24 max-w-2xl border-t border-border pt-12">
        <h3 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Having problems or need help? Contact us:</h3>
        <div className="mt-8 flex flex-wrap justify-center gap-12 sm:gap-24">
          <ContactAvatar name="Yasmine Ben Ali" role="OCP" />
          <ContactAvatar name="Aziz Trabelsi" role="OCVP DXP" />
        </div>
      </div>
    </section>
  )
}

function ContactAvatar({ name, role }: { name: string; role: string }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('')
  return (
    <div className="group flex flex-col items-center gap-4">
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/60 transition-transform duration-700 group-hover:rotate-180"
        />
        <div className="flex size-20 items-center justify-center rounded-full bg-primary font-display text-3xl text-primary-foreground">
          {initials}
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-xl text-foreground">{name}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-primary mt-1">{role}</p>
      </div>
    </div>
  )
}
