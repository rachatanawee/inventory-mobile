/**
 * ProductForm Component
 * Form for adding or editing products
 * Requirements: 1.1, 2.1, 8.2
 */

'use client';

import { useState, useEffect } from 'react';
import { Product, ProductInput } from '@/lib/types/product';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
  serverError?: string | null;
}

export default function ProductForm({
  initialProduct,
  onSubmit,
  onCancel,
  serverError,
}: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name || '');
  const [quantity, setQuantity] = useState(
    initialProduct?.quantity?.toString() || '0'
  );
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setQuantity(initialProduct.quantity.toString());
    }
  }, [initialProduct]);

  const validate = (): boolean => {
    const newErrors: string[] = [];

    // Validate name - must not be empty or whitespace only
    if (!name.trim()) {
      newErrors.push('กรุณากรอกชื่อสินค้า');
    }

    // Validate quantity - must be a number >= 0
    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      newErrors.push('จำนวนสินค้าต้องเป็นตัวเลขและมากกว่าหรือเท่ากับ 0');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      quantity: Number(quantity),
    });

    // Reset form
    setName('');
    setQuantity('0');
    setErrors([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-[#3282B8]">
      <h2 className="text-xl font-bold mb-4 text-[#1B262C]">
        {initialProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
      </h2>

      {/* Error Messages */}
      {(errors.length > 0 || serverError) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          {serverError && (
            <p className="text-red-700 text-sm font-medium mb-1">
              {serverError}
            </p>
          )}
          {errors.map((error, index) => (
            <p key={index} className="text-red-700 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Name Input */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#1B262C]">
          ชื่อสินค้า
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-base touch-manipulation"
          placeholder="กรอกชื่อสินค้า"
        />
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <label htmlFor="quantity" className="block text-sm font-medium mb-2 text-[#1B262C]">
          จำนวน
        </label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full px-4 py-3 border border-[#BBE1FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3282B8] text-base touch-manipulation"
          placeholder="กรอกจำนวนสินค้า"
          min="0"
        />
      </div>

      {/* Action Buttons - Touch-friendly */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-[#3282B8] text-white rounded-lg hover:bg-[#0F4C75] active:bg-[#1B262C] font-medium transition-colors touch-manipulation"
        >
          {initialProduct ? 'บันทึก' : 'เพิ่มสินค้า'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-[#BBE1FA] text-[#1B262C] rounded-lg hover:bg-[#3282B8] hover:text-white active:bg-[#0F4C75] font-medium transition-colors touch-manipulation"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
