import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as vercelSql } from '@vercel/postgres';
import * as schema from './schema';

// Create database instance
export const db = drizzle(vercelSql, { schema });

// Export schema for use in queries
export { schema };
