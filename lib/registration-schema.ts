import { z } from 'zod'

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s]{8,15}$/, 'Enter a valid phone number')
const url = z.string().trim().url('Enter a valid link (starting with https://)').max(500)

export const positions = ['newbie', 'oldie', 'mmb'] as const
export type Position = (typeof positions)[number]

export const identitySchema = z.object({
  firstName: z.string().trim().min(2, 'At least 2 characters').max(60),
  lastName: z.string().trim().min(2, 'At least 2 characters').max(60),
  nickname: z.string().trim().max(40).optional().or(z.literal('')),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick your date of birth')
    .refine((v) => {
      const d = new Date(v)
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000)
      return age >= 15 && age <= 40
    }, 'Please enter a valid date of birth'),
})

export const contactSchema = z.object({
  phone,
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(120),
  cin: z.string().trim().regex(/^\d{8}$/, 'CIN must be 8 digits'),
})

export const positionSchema = z.object({
  position: z.enum(positions, { message: 'Drop your position into the crate' }),
})

export const healthSchema = z.object({
  allergies: z.string().trim().max(300).optional().or(z.literal('')),
  medication: z.string().trim().max(300).optional().or(z.literal('')),
  emergencyContactName: z.string().trim().max(80).optional().or(z.literal('')),
  emergencyPhone: phone,
})

export const linksSchema = z.object({
  pictureUrl: url,
  motivationLetterUrl: url,
  cvUrl: url,
})

export const registrationSchema = identitySchema
  .merge(contactSchema)
  .merge(positionSchema)
  .merge(healthSchema)
  .merge(linksSchema)

export type RegistrationInput = z.infer<typeof registrationSchema>
