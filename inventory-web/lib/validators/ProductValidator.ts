/**
 * ProductValidator class
 * Validates product data according to business rules
 * Requirements: 1.2, 1.3, 2.2, 2.3
 */

import type { ProductInput, ValidationResult } from '../types/product';

export class ProductValidator {
  /**
   * Validate product name
   * Name must not be empty or whitespace only
   * Requirements: 1.2, 2.2
   */
  validateName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('กรุณากรอกชื่อสินค้า');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate product quantity
   * Quantity must be a number and >= 0
   * Requirements: 1.3, 2.3
   */
  validateQuantity(quantity: number): ValidationResult {
    const errors: string[] = [];

    if (typeof quantity !== 'number' || isNaN(quantity)) {
      errors.push('จำนวนสินค้าต้องเป็นตัวเลข');
    } else if (quantity < 0) {
      errors.push('จำนวนสินค้าต้องมากกว่าหรือเท่ากับ 0');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate complete product data
   * Validates all product fields
   * Requirements: 1.2, 1.3, 2.2, 2.3
   */
  validateProduct(input: ProductInput): ValidationResult {
    const errors: string[] = [];

    // Validate name
    const nameValidation = this.validateName(input.name);
    if (!nameValidation.isValid) {
      errors.push(...nameValidation.errors);
    }

    // Validate quantity
    const quantityValidation = this.validateQuantity(input.quantity);
    if (!quantityValidation.isValid) {
      errors.push(...quantityValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance for convenience
export const productValidator = new ProductValidator();
