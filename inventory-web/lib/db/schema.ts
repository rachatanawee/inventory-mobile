import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';

// Products table schema
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull().default(0),
  rfidTag: text('rfid_tag'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Export types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
