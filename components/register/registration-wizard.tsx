'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import type { z } from 'zod'
import { cn } from '@/lib/utils'
import {
  contactSchema,
  healthSchema,
  identitySchema,
  linksSchema,
  positionSchema,
  type Position,
} from '@/lib/registration-schema'
import { submitRegistration } from '@/app/actions/register'
import { Field } from './field'
import { PositionDrop } from './position-drop'

type FormState = {
  firstName: string
  lastName: string
  nickname: string
  dateOfBirth: string
  phone: string
  email: string
  cin: string
  position: Position | ''
  hasAllergy: boolean
  allergies: string
  hasMedication: boolean
  medication: string
  emergencyContactName: string
  emergencyPhone: string
  pictureUrl: string
  motivationLetterUrl: string
  cvUrl: string
}

const initial: FormState = {
  firstName: '',
  lastName: '',
  nickname: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  cin: '',
  position: '',
  hasAllergy: false,
  allergies: '',
  hasMedication: false,
  medication: '',
  emergencyContactName: '',
  emergencyPhone: '',
  pictureUrl: '',
  motivationLetterUrl: '',
  cvUrl: '',
}

const steps = [
  { title: 'Who are you?', subtitle: 'Identity', schema: identitySchema },
  { title: 'How do we reach you?', subtitle: 'Contact', schema: contactSchema },
  { title: 'Pick your rank', subtitle: 'Position', schema: positionSchema },
  { title: 'Your survival kit', subtitle: 'Health', schema: healthSchema },
  { title: 'Your dossier', subtitle: 'Documents', schema: linksSchema },
  { title: 'Final check', subtitle: 'Review', schema: null },
] as const

type Errors = Partial<Record<keyof FormState, string>>

export function RegistrationWizard() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [data, setData] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const payload = () => ({
    ...data,
    allergies: data.hasAllergy ? data.allergies : '',
    medication: data.hasMedication ? data.medication : '',
  })

  const validate = (schema: z.ZodTypeAny | null) => {
    if (!schema) return true
    const res = schema.safeParse(payload())
    if (res.success) return true
    const next: Errors = {}
    for (const issue of res.error.issues) {
      const k = issue.path[0] as keyof FormState
      if (!next[k]) next[k] = issue.message
    }
    setErrors(next)
    return false
  }

  const next = () => {
    if (!validate(steps[step].schema)) return
    if (step === 3) {
      if (data.hasAllergy && !data.allergies.trim()) {
        setErrors({ allergies: 'Tell us what you are allergic to' })
        return
      }
      if (data.hasMedication && !data.medication.trim()) {
        setErrors({ medication: 'Tell us which medication you take' })
        return
      }
    }
    setDir(1)
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const back = () => {
    setDir(-1)
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  const submit = () => {
    setServerError(null)
    startTransition(async () => {
      const res = await submitRegistration(payload())
      if (res.ok) setDone(true)
      else setServerError(res.error)
    })
  }

  if (done) return <SuccessCard name={data.nickname || data.firstName} />

  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur md:p-10">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span>
          Step {step + 1} / {steps.length}
        </span>
        <span className="text-primary">{steps[step].subtitle}</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label="Registration progress"
      >
        <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <ol className="mt-4 hidden justify-between sm:flex" aria-hidden>
        {steps.map((s, i) => (
          <li
            key={s.subtitle}
            className={cn(
              'flex size-7 items-center justify-center rounded-full border text-xs transition-colors',
              i < step && 'border-primary bg-primary text-primary-foreground',
              i === step && 'border-primary text-primary',
              i > step && 'border-border text-muted-foreground',
            )}
          >
            {i < step ? <Check className="size-3.5" /> : i + 1}
          </li>
        ))}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (step === steps.length - 1) submit()
          else next()
        }}
        noValidate
        className="mt-8"
      >
        <div className="mb-8 rounded-lg border border-primary/20 bg-primary/10 p-4 text-center text-sm text-foreground">
          <p className="font-semibold uppercase tracking-[0.1em] text-primary">Important Notice</p>
          <p className="mt-1 text-muted-foreground">The price of the conference is to be determined. Cancellation fees are 100%.</p>
        </div>
        <div
          key={step}
          className={cn(
            'animate-in fade-in duration-300',
            dir === 1 ? 'slide-in-from-right-8' : 'slide-in-from-left-8',
          )}
        >
          <h2 className="font-display text-4xl text-foreground">{steps[step].title}</h2>
          <div className="mt-6 flex flex-col gap-5">
            {step === 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="First name" name="firstName" autoComplete="given-name" value={data.firstName} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} autoFocus />
                  <Field label="Last name" name="lastName" autoComplete="family-name" value={data.lastName} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} />
                </div>
                <Field label="Nickname (optional)" name="nickname" placeholder="What should we call you?" value={data.nickname} onChange={(e) => set('nickname', e.target.value)} error={errors.nickname} />
                <Field label="Date of birth" name="dateOfBirth" type="date" autoComplete="bday" value={data.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} error={errors.dateOfBirth} />
              </>
            )}

            {step === 1 && (
              <>
                <Field label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+216 12 345 678" value={data.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} autoFocus />
                <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={data.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
                <Field label="CIN" name="cin" inputMode="numeric" maxLength={8} placeholder="8 digits" value={data.cin} onChange={(e) => set('cin', e.target.value.replace(/\D/g, ''))} error={errors.cin} hint="Your national ID card number." />
              </>
            )}

            {step === 2 && (
              <PositionDrop value={data.position} onChange={(p) => set('position', p)} error={errors.position} />
            )}

            {step === 3 && (
              <>
                <YesNo
                  question="Do you have any allergy?"
                  value={data.hasAllergy}
                  onChange={(v) => set('hasAllergy', v)}
                />
                {data.hasAllergy && (
                  <Field label="Which allergy?" name="allergies" placeholder="e.g. peanuts, penicillin, pollen" value={data.allergies} onChange={(e) => set('allergies', e.target.value)} error={errors.allergies} className="animate-in fade-in slide-in-from-top-2" />
                )}
                <YesNo
                  question="Do you take any medication?"
                  value={data.hasMedication}
                  onChange={(v) => set('hasMedication', v)}
                />
                {data.hasMedication && (
                  <Field label="Which medication?" name="medication" placeholder="Name and dosage if possible" value={data.medication} onChange={(e) => set('medication', e.target.value)} error={errors.medication} className="animate-in fade-in slide-in-from-top-2" />
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Emergency contact name" name="emergencyContactName" placeholder="Mom, Dad, ..." value={data.emergencyContactName} onChange={(e) => set('emergencyContactName', e.target.value)} error={errors.emergencyContactName} />
                  <Field label="Emergency number" name="emergencyPhone" type="tel" inputMode="tel" placeholder="+216 ..." value={data.emergencyPhone} onChange={(e) => set('emergencyPhone', e.target.value)} error={errors.emergencyPhone} />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <Field label="Picture link" name="pictureUrl" type="url" placeholder="https://drive.google.com/..." value={data.pictureUrl} onChange={(e) => set('pictureUrl', e.target.value)} error={errors.pictureUrl} hint="A clear photo of you (Drive, Dropbox, ...). Make the link public." autoFocus />
                <Field label="Letter of intent link" name="motivationLetterUrl" type="url" placeholder="https://..." value={data.motivationLetterUrl} onChange={(e) => set('motivationLetterUrl', e.target.value)} error={errors.motivationLetterUrl} hint="Why do you want to join LMS 2K26?" />
                <Field label="CV link" name="cvUrl" type="url" placeholder="https://..." value={data.cvUrl} onChange={(e) => set('cvUrl', e.target.value)} error={errors.cvUrl} />
              </>
            )}

            {step === 5 && <Review data={data} onEdit={(s) => { setDir(-1); setStep(s) }} />}
          </div>
        </div>

        {serverError && (
          <p role="alert" className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || pending}
            className="inline-flex items-center gap-2 rounded-md px-4 py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground disabled:invisible"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <button
            type="submit"
            disabled={pending}
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sending
              </>
            ) : step === steps.length - 1 ? (
              <>
                Submit <Check className="size-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function YesNo({ question, value, onChange }: { question: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{question}</legend>
      <div className="mt-2 flex gap-3">
        {[
          { v: false, label: 'No' },
          { v: true, label: 'Yes' },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={cn(
              'flex-1 rounded-md border border-border px-4 py-3 text-sm uppercase tracking-[0.2em] transition-all',
              value === o.v ? 'border-primary bg-primary/15 text-foreground' : 'text-muted-foreground hover:border-primary/50',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Review({ data, onEdit }: { data: FormState; onEdit: (step: number) => void }) {
  const groups: { step: number; title: string; rows: [string, string][] }[] = [
    {
      step: 0,
      title: 'Identity',
      rows: [
        ['Name', `${data.firstName} ${data.lastName}`],
        ['Nickname', data.nickname || '—'],
        ['Date of birth', data.dateOfBirth],
      ],
    },
    { step: 1, title: 'Contact', rows: [['Phone', data.phone], ['Email', data.email], ['CIN', data.cin]] },
    { step: 2, title: 'Position', rows: [['Position', data.position.toUpperCase()]] },
    {
      step: 3,
      title: 'Health',
      rows: [
        ['Allergy', data.hasAllergy ? data.allergies : 'None'],
        ['Medication', data.hasMedication ? data.medication : 'None'],
        ['Emergency', `${data.emergencyContactName || '—'} · ${data.emergencyPhone}`],
      ],
    },
    {
      step: 4,
      title: 'Documents',
      rows: [['Picture', data.pictureUrl], ['Letter of intent', data.motivationLetterUrl], ['CV', data.cvUrl]],
    },
  ]
  return (
    <div className="flex flex-col gap-4">
      {groups.map((g) => (
        <section key={g.title} className="rounded-lg border border-border bg-background/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.25em] text-primary">{g.title}</h3>
            <button type="button" onClick={() => onEdit(g.step)} className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
              Edit
            </button>
          </div>
          <dl className="mt-3 flex flex-col gap-2 text-sm">
            {g.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted-foreground">{k}</dt>
                <dd className="truncate text-right text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}

function SuccessCard({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-primary/50 bg-card/60 p-10 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-8" />
      </div>
      <h2 className="mt-6 font-display text-5xl text-foreground">Welcome aboard, {name}.</h2>
      <p className="mt-3 max-w-md text-muted-foreground">
        Your registration is in. The organizing committee will reach out by email with the next steps. See you
        on 23 October &mdash; the clock is ticking.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/shop" className="rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground">
          Pre-order merch
        </Link>
        <Link href="/team" className="rounded-md border border-border px-6 py-3 text-sm uppercase tracking-[0.2em] text-foreground hover:bg-accent">
          Meet the team
        </Link>
      </div>

      <div className="mt-12 w-full border-t border-border pt-8">
        <h3 className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Need any help? Contact us:</h3>
        <div className="mt-6 flex flex-wrap justify-center gap-8 sm:gap-16">
          <ContactAvatar name="Yasmine Ben Ali" role="OCP" />
          <ContactAvatar name="Aziz Trabelsi" role="OCVP DXP" />
        </div>
      </div>
    </div>
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
        <div className="flex size-16 items-center justify-center rounded-full bg-primary font-display text-2xl text-primary-foreground">
          {initials}
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-lg text-foreground">{name}</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">{role}</p>
      </div>
    </div>
  )
}
