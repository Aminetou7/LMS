import { date, jsonb, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  nickname: text('nickname'),
  dateOfBirth: date('date_of_birth').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull().unique(),
  cin: text('cin').notNull().unique(),
  position: text('position').notNull(),
  allergies: text('allergies'),
  medication: text('medication'),
  emergencyContactName: text('emergency_contact_name'),
  emergencyPhone: text('emergency_phone').notNull(),
  pictureUrl: text('picture_url').notNull(),
  motivationLetterUrl: text('motivation_letter_url').notNull(),
  cvUrl: text('cv_url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type PreorderItem = {
  productId: string
  name: string
  size: string | null
  quantity: number
  unitPrice: number
}

export const preorders = pgTable('preorders', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  items: jsonb('items').$type<PreorderItem[]>().notNull(),
  totalTnd: numeric('total_tnd', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
