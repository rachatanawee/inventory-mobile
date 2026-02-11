/**
 * Database queries for Product CRUD operations
 * Requirements: 1.1, 2.1, 4.1, 6.1, 6.2
 */

import { eq } from 'drizzle-orm';
import { db } from './index';
import { products, type Product, type NewProduct } from './schema';

/**
 * Get all products from the database
 * Requirements: 6.2
 */
export async function getProducts(): Promise<Product[]> {
  return await db.select().from(products);
}

/**
 * Get a single product by ID
 * Requirements: 2.1, 4.1
 */
export async function getProduct(id: string): Promise<Product | undefined> {
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0];
}

/**
 * Create a new product
 * Requirements: 1.1, 6.1
 */
export async function createProduct(input: Omit<NewProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const result = await db.insert(products).values(input).returning();
  return result[0];
}

/**
 * Update an existing product
 * Requirements: 2.1, 6.1
 */
export async function updateProduct(id: string, input: Partial<Omit<NewProduct, 'id' | 'createdAt'>>): Promise<Product | undefined> {
  const result = await db
    .update(products)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();
  return result[0];
}

/**
 * Delete a product by ID
 * Requirements: 4.1, 6.1
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const result = await db.delete(products).where(eq(products.id, id)).returning();
  return result.length > 0;
}

/**
 * Get a product by RFID tag
 * Requirements: 10.3
 */
export async function getProductByRFIDTag(rfidTag: string): Promise<Product | undefined> {
  const result = await db.select().from(products).where(eq(products.rfidTag, rfidTag));
  return result[0];
}
