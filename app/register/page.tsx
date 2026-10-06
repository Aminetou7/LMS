import type { Metadata } from 'next'
import { RegistrationWizard } from '@/components/register/registration-wizard'

export const metadata: Metadata = {
  title: 'Register — LMS 2K26',
  description: 'Register for LMS 2K26, the 3-day conference of AIESEC in Hadrumet.',
}

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-primary">Registration</p>
      <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Join the survivors</h1>
      <p className="mt-3 text-muted-foreground">Six quick steps. Your progress is kept as you go.</p>
      <div className="mt-10">
        <RegistrationWizard />
      </div>
    </main>
  )
}
