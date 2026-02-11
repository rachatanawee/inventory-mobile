/**
 * Unit tests for ProductValidator
 * Requirements: 1.2, 1.3, 2.2, 2.3
 */

import { describe, test, expect } from 'vitest';
import { ProductValidator } from '@/lib/validators/ProductValidator';

describe('ProductValidator', () => {
  const validator = new ProductValidator();

  describe('validateName', () => {
    test('should accept valid non-empty name', () => {
      const result = validator.validateName('สินค้าทดสอบ');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject empty string', () => {
      const result = validator.validateName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('กรุณากรอกชื่อสินค้า');
    });

    test('should reject whitespace-only string', () => {
      const result = validator.validateName('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('กรุณากรอกชื่อสินค้า');
    });

    test('should accept name with leading/trailing spaces', () => {
      const result = validator.validateName('  สินค้า  ');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateQuantity', () => {
    test('should accept zero quantity', () => {
      const result = validator.validateQuantity(0);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should accept positive quantity', () => {
      const result = validator.validateQuantity(10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject negative quantity', () => {
      const result = validator.validateQuantity(-1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('จำนวนสินค้าต้องมากกว่าหรือเท่ากับ 0');
    });

    test('should reject NaN', () => {
      const result = validator.validateQuantity(NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('จำนวนสินค้าต้องเป็นตัวเลข');
    });
  });

  describe('validateProduct', () => {
    test('should accept valid product', () => {
      const result = validator.validateProduct({
        name: 'สินค้าทดสอบ',
        quantity: 10,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject product with empty name', () => {
      const result = validator.validateProduct({
        name: '',
        quantity: 10,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('กรุณากรอกชื่อสินค้า');
    });

    test('should reject product with negative quantity', () => {
      const result = validator.validateProduct({
        name: 'สินค้าทดสอบ',
        quantity: -5,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('จำนวนสินค้าต้องมากกว่าหรือเท่ากับ 0');
    });

    test('should reject product with both invalid name and quantity', () => {
      const result = validator.validateProduct({
        name: '   ',
        quantity: -1,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('กรุณากรอกชื่อสินค้า');
      expect(result.errors).toContain('จำนวนสินค้าต้องมากกว่าหรือเท่ากับ 0');
    });

    test('should accept product with optional rfidTag', () => {
      const result = validator.validateProduct({
        name: 'สินค้าทดสอบ',
        quantity: 5,
        rfidTag: 'RFID123',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
