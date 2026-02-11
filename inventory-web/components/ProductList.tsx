/**
 * ProductList Component
 * Displays all products in the inventory
 * Requirements: 5.1, 5.2, 5.3
 */

import { Product } from '@/lib/types/product';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onIncrease: (id: string, amount: number) => void;
  onDecrease: (id: string, amount: number) => void;
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
  onIncrease,
  onDecrease,
}: ProductListProps) {
  // Show empty state when no products
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-[#0F4C75]">
        <p className="text-lg">ไม่มีสินค้าในระบบ</p>
        <p className="text-sm mt-2">เพิ่มสินค้าใหม่เพื่อเริ่มต้นใช้งาน</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product.id)}
          onIncrease={(amount) => onIncrease(product.id, amount)}
          onDecrease={(amount) => onDecrease(product.id, amount)}
        />
      ))}
    </div>
  );
}
