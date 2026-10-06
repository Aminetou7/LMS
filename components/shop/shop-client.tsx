'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { Check, Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_PER_LINE, MAX_PER_ORDER, products, type Product } from '@/lib/products'
import { submitPreorder } from '@/app/actions/preorder'
import { Field } from '@/components/register/field'

type Line = { productId: string; size: string | null; quantity: number }

export function ShopClient() {
  const [cart, setCart] = useState<Line[]>([])
  const totalQty = cart.reduce((s, l) => s + l.quantity, 0)

  const add = (product: Product, size: string | null) => {
    setCart((c) => {
      const productQty = c.filter((l) => l.productId === product.id).reduce((s, l) => s + l.quantity, 0)
      if (productQty >= MAX_PER_LINE || c.reduce((s, l) => s + l.quantity, 0) >= MAX_PER_ORDER) return c
      const idx = c.findIndex((l) => l.productId === product.id && l.size === size)
      if (idx === -1) return [...c, { productId: product.id, size, quantity: 1 }]
      return c.map((l, i) => (i === idx ? { ...l, quantity: l.quantity + 1 } : l))
    })
  }

  const update = (index: number, delta: number) => {
    setCart((c) =>
      c
        .map((l, i) => {
          if (i !== index) return l
          const productQty = c.filter((x) => x.productId === l.productId).reduce((s, x) => s + x.quantity, 0)
          if (delta > 0 && (productQty >= MAX_PER_LINE || totalQty >= MAX_PER_ORDER)) return l
          return { ...l, quantity: l.quantity + delta }
        })
        .filter((l) => l.quantity > 0),
    )
  }

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
      <ul className="grid flex-1 gap-6 sm:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={add} />
        ))}
      </ul>
      <aside className="w-full lg:sticky lg:top-24 lg:w-96">
        <Cart cart={cart} update={update} clear={() => setCart([])} />
      </aside>
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product, size: string | null) => void }) {
  const [size, setSize] = useState<string | null>(product.sizes ? product.sizes[1] : null)
  const [added, setAdded] = useState(false)

  return (
    <li className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 transition-colors hover:border-primary/60">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-foreground backdrop-blur">
          Pre-order
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-3xl leading-none text-foreground">{product.name}</h2>
          <p className="shrink-0 font-semibold text-primary">{product.price} TND</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>

        {product.sizes && (
          <div role="radiogroup" aria-label={`${product.name} size`} className="mt-4 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={cn(
                  'min-w-10 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors',
                  size === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/60',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onAdd(product, size)
            setAdded(true)
            setTimeout(() => setAdded(false), 1200)
          }}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          {added ? <Check className="size-4" /> : <Plus className="size-4" />}
          {added ? 'Added' : 'Add to cart'}
        </button>
      </div>
    </li>
  )
}

function Cart({ cart, update, clear }: { cart: Line[]; update: (i: number, d: number) => void; clear: () => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{ id: number; total: number } | null>(null)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' })

  const lines = cart.map((l) => ({ ...l, product: products.find((p) => p.id === l.productId)! }))
  const total = lines.reduce((s, l) => s + l.product.price * l.quantity, 0)

  if (confirmed) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-primary/50 bg-card/60 p-8 text-center animate-in fade-in zoom-in-95">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-7" />
        </div>
        <h2 className="mt-4 font-display text-4xl text-foreground">Order #{confirmed.id} secured</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Total {confirmed.total} TND &mdash; pay and collect at check-in on 23 October.
        </p>
        <button
          type="button"
          onClick={() => setConfirmed(null)}
          className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Place another order
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card/60 p-6">
      <div className="flex items-center gap-2">
        <ShoppingBag className="size-5 text-primary" aria-hidden />
        <h2 className="font-display text-3xl text-foreground">Your crate</h2>
      </div>

      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Empty. Grab some supplies before the storm.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {lines.map((l, i) => (
            <li key={`${l.productId}-${l.size}`} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={l.product.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{l.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {l.size ? `Size ${l.size} · ` : ''}
                  {l.product.price * l.quantity} TND
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => update(i, -1)} className="rounded-md border border-border p-1.5 hover:bg-accent">
                  {l.quantity === 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
                  <span className="sr-only">Decrease</span>
                </button>
                <span className="w-6 text-center text-sm tabular-nums">{l.quantity}</span>
                <button type="button" onClick={() => update(i, 1)} className="rounded-md border border-border p-1.5 hover:bg-accent">
                  <Plus className="size-3.5" />
                  <span className="sr-only">Increase</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total</span>
        <span className="font-display text-3xl text-foreground">{total} TND</span>
      </div>

      {lines.length > 0 && (
        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            setError(null)
            startTransition(async () => {
              const res = await submitPreorder({
                ...form,
                items: cart.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
              })
              if (res.ok) {
                setConfirmed({ id: res.id, total: res.total })
                clear()
              } else setError(res.error)
            })
          }}
        >
          <Field label="Full name" name="fullName" autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <Field label="Email" name="shopEmail" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Field label="Phone" name="shopPhone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Pre-order
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Max {MAX_PER_LINE} per product &middot; {MAX_PER_ORDER} per order
          </p>
        </form>
      )}
    </div>
  )
}
