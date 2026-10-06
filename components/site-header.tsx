'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/team', label: 'The Team' },
  { href: '/shop', label: 'Shop' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"
      >
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-3xl leading-none text-foreground">LMS</span>
          <span className="font-display text-2xl leading-none text-primary">2K26</span>
          <span className="sr-only">Home</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  'text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground',
                  pathname === l.href && 'text-foreground',
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
            >
              Register
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </nav>

      {open && (
        <ul id="mobile-nav" className="flex flex-col gap-1 border-t border-border px-4 py-4 md:hidden">
          {[...links, { href: '/register', label: 'Register' }].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'block rounded-md px-3 py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:bg-accent',
                  pathname === l.href && 'text-foreground',
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
