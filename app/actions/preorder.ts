'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { preorders, type PreorderItem } from '@/lib/db/schema'
import { MAX_PER_LINE, MAX_PER_ORDER, products } from '@/lib/products'

const schema = z.object({
  fullName: z.string().trim().min(3, 'Enter your full name').max(100),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(120),
  phone: z.string().trim().regex(/^\+?[0-9\s]{8,15}$/, 'Enter a valid phone number'),
  items: z
    .array(
      z.object({
        productId: z.string(),
        size: z.string().nullable(),
        quantity: z.number().int().min(1).max(MAX_PER_LINE),
      }),
    )
    .min(1, 'Your cart is empty')
    .max(20),
})

export type PreorderResult = { ok: true; id: number; total: number } | { ok: false; error: string }

export async function submitPreorder(input: unknown): Promise<PreorderResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid order' }

  const merged = new Map<string, PreorderItem>()
  for (const line of parsed.data.items) {
    const product = products.find((p) => p.id === line.productId)
    if (!product) return { ok: false, error: 'Unknown product in cart' }
    const size = product.sizes ? line.size : null
    if (product.sizes && (!size || !product.sizes.includes(size))) {
      return { ok: false, error: `Pick a valid size for ${product.name}` }
    }
    const key = `${product.id}:${size ?? ''}`
    const prev = merged.get(key)
    merged.set(key, {
      productId: product.id,
      name: product.name,
      size,
      unitPrice: product.price,
      quantity: (prev?.quantity ?? 0) + line.quantity,
    })
  }

  const items = [...merged.values()]
  const perProduct = new Map<string, number>()
  for (const i of items) perProduct.set(i.productId, (perProduct.get(i.productId) ?? 0) + i.quantity)
  if ([...perProduct.values()].some((q) => q > MAX_PER_LINE)) {
    return { ok: false, error: `Max ${MAX_PER_LINE} per product` }
  }
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)
  if (totalQty > MAX_PER_ORDER) return { ok: false, error: `Max ${MAX_PER_ORDER} items per order` }

  const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)

  try {
    const [row] = await db
      .insert(preorders)
      .values({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        items,
        totalTnd: total.toFixed(2),
      })
      .returning({ id: preorders.id })

    // If a Google Sheets webhook URL is configured for the shop, send the data there
    if (process.env.GOOGLE_SHEET_SHOP_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_SHEET_SHOP_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: row.id,
            fullName: parsed.data.fullName,
            email: parsed.data.email,
            phone: parsed.data.phone,
            items: items.map(i => `${i.quantity}x ${i.name}${i.size ? ` (${i.size})` : ''}`).join(', '),
            totalTnd: total.toFixed(2),
          }),
        })
      } catch (webhookError) {
        console.error('Failed to send preorder data to Google Sheets webhook:', webhookError)
      }
    }

    return { ok: true, id: row.id, total }
  } catch (error) {
    console.error('Preorder error:', error)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
