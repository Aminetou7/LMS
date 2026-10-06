import type { Metadata } from 'next'
import { ShopClient } from '@/components/shop/shop-client'

export const metadata: Metadata = {
  title: 'AIESEC Shop — LMS 2K26',
  description: 'Pre-order your LMS 2K26 merch and pick it up at the conference.',
}

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-primary">AIESEC Shop</p>
      <h1 className="mt-3 font-display text-5xl text-foreground md:text-7xl">Supply drop</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Pre-order your LMS 2K26 gear now and collect it at check-in on Day 01. Payment is made on pickup.
      </p>
      <div className="mt-12">
        <ShopClient />
      </div>
    </main>
  )
}
