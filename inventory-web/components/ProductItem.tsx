/**
 * ProductItem Component
 * Displays individual product with action buttons
 * Requirements: 5.2, 8.1, 8.2
 */

import { Product } from '@/lib/types/product';

interface ProductItemProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onIncrease: (amount: number) => void;
  onDecrease: (amount: number) => void;
}

export default function ProductItem({
  product,
  onEdit,
  onDelete,
  onIncrease,
  onDecrease,
}: ProductItemProps) {
  return (
    <div className="border border-[#3282B8] rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Product Info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#1B262C] mb-1">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-[#3282B8]">
            {product.quantity}
          </p>
          <p className="text-sm text-[#0F4C75]">หน่วย</p>
        </div>
      </div>

      {/* Action Buttons - Touch-friendly, responsive */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          onClick={() => onIncrease(1)}
          className="px-4 py-3 bg-[#3282B8] text-white rounded-lg hover:bg-[#0F4C75] active:bg-[#1B262C] font-medium transition-colors touch-manipulation"
          aria-label="เพิ่มจำนวนสินค้า"
        >
          + เพิ่ม
        </button>
        <button
          onClick={() => onDecrease(1)}
          className="px-4 py-3 bg-[#BBE1FA] text-[#1B262C] rounded-lg hover:bg-[#3282B8] hover:text-white active:bg-[#0F4C75] font-medium transition-colors touch-manipulation"
          aria-label="ลดจำนวนสินค้า"
        >
          - ลด
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-3 bg-[#0F4C75] text-white rounded-lg hover:bg-[#1B262C] active:bg-[#1B262C] font-medium transition-colors touch-manipulation"
          aria-label="แก้ไขสินค้า"
        >
          แก้ไข
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 font-medium transition-colors touch-manipulation"
          aria-label="ลบสินค้า"
        >
          ลบ
        </button>
      </div>
    </div>
  );
}
