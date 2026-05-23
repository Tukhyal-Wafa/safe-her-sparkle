import { db, schema } from '@/db';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// User operations
export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await db.insert(schema.users).values({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  }).returning();
  return user;
}

export async function authenticateUser(email: string, password: string) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  
  return { id: user.id, name: user.name, email: user.email };
}

export async function getUserById(userId: string) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
  return user;
}

// Contact operations
export async function getContacts(userId: string) {
  return await db.select().from(schema.contacts).where(eq(schema.contacts.userId, userId));
}

export async function addContact(userId: string, name: string, phone: string, relation?: string) {
  const [contact] = await db.insert(schema.contacts).values({
    userId,
    name,
    phone,
    relation,
  }).returning();
  return contact;
}

export async function deleteContact(contactId: string, userId: string) {
  await db.delete(schema.contacts).where(
    and(
      eq(schema.contacts.id, contactId),
      eq(schema.contacts.userId, userId)
    )
  );
}

// Incident operations
export async function createIncident(
  userId: string,
  type: 'sos_button' | 'voice_trigger' | 'video_recording',
  data: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    address?: string;
    message?: string;
    videoBlob?: string;
    contactsNotified?: string[];
  }
) {
  const [incident] = await db.insert(schema.incidents).values({
    userId,
    type,
    ...data,
  }).returning();
  return incident;
}

export async function getIncidents(userId: string, limit = 50) {
  return await db.select()
    .from(schema.incidents)
    .where(eq(schema.incidents.userId, userId))
    .orderBy(desc(schema.incidents.createdAt))
    .limit(limit);
}

export async function getIncidentsByDateRange(userId: string, startDate: Date, endDate: Date) {
  return await db.select()
    .from(schema.incidents)
    .where(
      and(
        eq(schema.incidents.userId, userId),
        gte(schema.incidents.createdAt, startDate),
        lte(schema.incidents.createdAt, endDate)
      )
    )
    .orderBy(desc(schema.incidents.createdAt));
}

// Voice settings operations
export async function getVoiceSettings(userId: string) {
  const [settings] = await db.select()
    .from(schema.voiceSettings)
    .where(eq(schema.voiceSettings.userId, userId));
  
  if (!settings) {
    // Create default settings
    const [newSettings] = await db.insert(schema.voiceSettings).values({
      userId,
      keyword: 'help',
      repeatCount: 3,
      enabled: 0,
    }).returning();
    return newSettings;
  }
  
  return settings;
}

export async function updateVoiceSettings(
  userId: string,
  keyword: string,
  repeatCount: number,
  enabled: boolean
) {
  const [settings] = await db.update(schema.voiceSettings)
    .set({
      keyword,
      repeatCount,
      enabled: enabled ? 1 : 0,
      updatedAt: new Date(),
    })
    .where(eq(schema.voiceSettings.userId, userId))
    .returning();
  
  return settings;
}

// Report operations
export async function createReport(
  userId: string,
  title: string,
  description: string,
  incidentIds: string[],
  startDate: Date,
  endDate: Date
) {
  const [report] = await db.insert(schema.reports).values({
    userId,
    title,
    description,
    incidentIds,
    startDate,
    endDate,
  }).returning();
  return report;
}

export async function getReports(userId: string) {
  return await db.select()
    .from(schema.reports)
    .where(eq(schema.reports.userId, userId))
    .orderBy(desc(schema.reports.createdAt));
}

export async function getReportById(reportId: string, userId: string) {
  const [report] = await db.select()
    .from(schema.reports)
    .where(
      and(
        eq(schema.reports.id, reportId),
        eq(schema.reports.userId, userId)
      )
    );
  return report;
}
