import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Countdown } from '@/components/countdown'
import { Atmosphere } from '@/components/atmosphere'

export function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden">
      <Image
        src="/images/hero-forest.png"
        alt=""
        fill
        priority
        className="-z-20 object-cover opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/30 to-background" />
      <Atmosphere />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-secondary">AIESEC in Hadrumet presents</p>

        <h1 className="mt-6 font-display text-8xl leading-[0.85] text-foreground drop-shadow-[0_0_30px_rgba(255,240,210,0.35)] md:text-[10rem]">
          LMS
          <span className="block text-primary">2K26</span>
        </h1>

        <p className="mt-6 text-sm uppercase tracking-[0.5em] text-foreground/80 md:text-base">
          The clock is ticking
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          23 — 25 October 2026 &middot; 3 days &middot; Sousse, Tunisia
        </p>

        <div className="mt-10">
          <Countdown />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_40px_-5px] shadow-primary/60 transition-transform hover:scale-105"
          >
            Secure your spot
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#about"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-foreground backdrop-blur hover:bg-accent"
          >
            What is LMS?
          </Link>
        </div>
      </div>
    </section>
  )
}

export function BannerImage() {
  return (
    <Image
      src="/images/lms-banner.png"
      alt="LMS 2026 banner: owl perched on a thorn wreath, lightning and parachutes over a foggy forest"
      width={1050}
      height={406}
      className="w-full rounded-lg border border-border"
    />
  )
}
