import { pgTable, text, timestamp, uuid, real, jsonb, integer } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Emergency contacts table
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  relation: text('relation'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// SOS events/incidents table
export const incidents = pgTable('incidents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'sos_button', 'voice_trigger', 'video_recording'
  latitude: real('latitude'),
  longitude: real('longitude'),
  accuracy: real('accuracy'),
  address: text('address'),
  message: text('message'),
  videoUrl: text('video_url'), // URL to stored video
  videoBlob: text('video_blob'), // Base64 encoded video data
  contactsNotified: jsonb('contacts_notified').$type<string[]>(), // Array of contact IDs
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Voice settings table
export const voiceSettings = pgTable('voice_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  keyword: text('keyword').notNull().default('help'),
  repeatCount: integer('repeat_count').notNull().default(3),
  enabled: integer('enabled').notNull().default(0), // 0 = false, 1 = true (SQLite compatibility)
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reports table - for generating PDF reports
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  incidentIds: jsonb('incident_ids').$type<string[]>(), // Array of incident IDs included
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  pdfUrl: text('pdf_url'), // URL to generated PDF
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Incident = typeof incidents.$inferSelect;
export type NewIncident = typeof incidents.$inferInsert;
export type VoiceSettings = typeof voiceSettings.$inferSelect;
export type NewVoiceSettings = typeof voiceSettings.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
