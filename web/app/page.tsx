/**
 * Inventory Management System - Main Page
 * Server Component that fetches data from database
 * Requirements: 1.1, 2.1, 3.1, 3.2, 4.1, 5.1, 6.1, 6.2
 */

import { getProducts } from '@/lib/db/queries';
import { Product } from '@/lib/types/product';
import InventoryClient from '@/components/InventoryClient';

// Convert database product to client product format
function convertProduct(dbProduct: {
  id: string;
  name: string;
  quantity: number;
  rfidTag: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    quantity: dbProduct.quantity,
    rfidTag: dbProduct.rfidTag || undefined,
    createdAt: new Date(dbProduct.createdAt).getTime(),
    updatedAt: new Date(dbProduct.updatedAt).getTime(),
  };
}

export default async function Home() {
  // Fetch products from database
  const dbProducts = await getProducts();
  const products = dbProducts.map(convertProduct);

  return <InventoryClient initialProducts={products} />;
}

// Enable ISR with revalidation every 10 seconds
export const revalidate = 10;
