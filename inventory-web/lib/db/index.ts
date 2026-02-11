import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// สร้าง PostgreSQL connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/inventory';

// สร้าง postgres client
export const client = postgres(connectionString);

// สร้าง drizzle instance
export const db = drizzle(client);
