'use server'

import { or, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { registrations } from '@/lib/db/schema'
import { registrationSchema } from '@/lib/registration-schema'

export type RegisterResult = { ok: true; id: number } | { ok: false; error: string }

export async function submitRegistration(input: unknown): Promise<RegisterResult> {
  const parsed = registrationSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' }
  }
  const d = parsed.data

  const existing = await db
    .select({ id: registrations.id })
    .from(registrations)
    .where(or(eq(registrations.email, d.email), eq(registrations.cin, d.cin)))
    .limit(1)
  if (existing.length > 0) {
    return { ok: false, error: 'Someone already registered with this email or CIN.' }
  }

  try {
    const [row] = await db
      .insert(registrations)
      .values({
        firstName: d.firstName,
        lastName: d.lastName,
        nickname: d.nickname || null,
        dateOfBirth: d.dateOfBirth,
        phone: d.phone,
        email: d.email,
        cin: d.cin,
        position: d.position,
        allergies: d.allergies || null,
        medication: d.medication || null,
        emergencyContactName: d.emergencyContactName || null,
        emergencyPhone: d.emergencyPhone,
        pictureUrl: d.pictureUrl,
        motivationLetterUrl: d.motivationLetterUrl,
        cvUrl: d.cvUrl,
      })
      .returning({ id: registrations.id })

    // If a Google Sheets webhook URL is configured, send the data there
    if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: row.id,
            ...d
          }),
        })
      } catch (webhookError) {
        console.error('Failed to send data to Google Sheets webhook:', webhookError)
        // We don't fail the registration if the webhook fails, but we log it
      }
    }

    return { ok: true, id: row.id }
  } catch (error) {
    console.error('Registration error:', error)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
