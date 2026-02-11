/**
 * Server Actions for Product operations
 * Requirements: 1.1, 2.1, 3.1, 3.2, 4.1
 */

'use server';

import { revalidatePath } from 'next/cache';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByRFIDTag,
} from '../db/queries';
import type { ProductInput, RFIDScanResult } from '../types/product';
import { productValidator } from '../validators/ProductValidator';

/**
 * Add a new product
 * Requirements: 1.1, 1.2, 1.3, 9.1, 9.2
 */
export async function addProductAction(input: ProductInput) {
  try {
    // Validate input before saving to database
    const validation = productValidator.validateProduct(input);
    
    if (!validation.isValid) {
      return { 
        success: false, 
        error: validation.errors.join(', ') 
      };
    }
    
    const product = await createProduct({
      name: input.name,
      quantity: input.quantity,
      rfidTag: input.rfidTag,
    });
    
    revalidatePath('/');
    return { success: true, data: product };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: 'ไม่สามารถเพิ่มสินค้าได้' };
  }
}

/**
 * Update an existing product
 * Requirements: 2.1, 2.2, 2.3, 9.1, 9.2
 */
export async function updateProductAction(id: string, input: ProductInput) {
  try {
    // Validate input before saving to database
    const validation = productValidator.validateProduct(input);
    
    if (!validation.isValid) {
      return { 
        success: false, 
        error: validation.errors.join(', ') 
      };
    }
    
    const product = await updateProduct(id, {
      name: input.name,
      quantity: input.quantity,
      rfidTag: input.rfidTag,
    });
    
    if (!product) {
      return { success: false, error: 'ไม่พบสินค้าที่ต้องการแก้ไข' };
    }
    
    revalidatePath('/');
    return { success: true, data: product };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'ไม่สามารถแก้ไขสินค้าได้' };
  }
}

/**
 * Delete a product
 * Requirements: 4.1
 */
export async function deleteProductAction(id: string) {
  try {
    const deleted = await deleteProduct(id);
    
    if (!deleted) {
      return { success: false, error: 'ไม่พบสินค้าที่ต้องการลบ' };
    }
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'ไม่สามารถลบสินค้าได้' };
  }
}

/**
 * Increase product quantity
 * Requirements: 3.1
 */
export async function increaseQuantityAction(id: string, amount: number = 1) {
  try {
    const product = await getProduct(id);
    
    if (!product) {
      return { success: false, error: 'ไม่พบสินค้า' };
    }
    
    const updated = await updateProduct(id, {
      quantity: product.quantity + amount,
    });
    
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error increasing quantity:', error);
    return { success: false, error: 'ไม่สามารถเพิ่มจำนวนสินค้าได้' };
  }
}

/**
 * Decrease product quantity
 * Requirements: 3.2
 */
export async function decreaseQuantityAction(id: string, amount: number = 1) {
  try {
    const product = await getProduct(id);
    
    if (!product) {
      return { success: false, error: 'ไม่พบสินค้า' };
    }
    
    const newQuantity = product.quantity - amount;
    
    if (newQuantity < 0) {
      return { success: false, error: 'ไม่สามารถลดจำนวนได้ เนื่องจากจำนวนคงเหลือไม่เพียงพอ' };
    }
    
    const updated = await updateProduct(id, {
      quantity: newQuantity,
    });
    
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    return { success: false, error: 'ไม่สามารถลดจำนวนสินค้าได้' };
  }
}

/**
 * Get all products (for client components)
 * Requirements: 6.2
 */
export async function getProductsAction() {
  try {
    const products = await getProducts();
    return { success: true, data: products };
  } catch (error) {
    console.error('Error getting products:', error);
    return { success: false, error: 'ไม่สามารถโหลดข้อมูลสินค้าได้' };
  }
}

/**
 * Handle RFID scan result
 * Requirements: 10.3, 10.4, 10.5
 */
export async function handleRFIDScanAction(scanResult: RFIDScanResult) {
  try {
    // Requirement 10.3: Search for product with matching RFID tag
    const existingProduct = await getProductByRFIDTag(scanResult.epc);
    
    if (existingProduct) {
      // Requirement 10.4: If found, increase quantity automatically
      const updated = await updateProduct(existingProduct.id, {
        quantity: existingProduct.quantity + 1,
      });
      
      revalidatePath('/');
      return { 
        success: true, 
        found: true,
        data: updated,
        message: `เพิ่มจำนวนสินค้า "${existingProduct.name}" แล้ว`
      };
    } else {
      // Requirement 10.5: If not found, return info to show form
      return { 
        success: true, 
        found: false,
        rfidTag: scanResult.epc,
        message: 'ไม่พบสินค้า กรุณาเพิ่มสินค้าใหม่'
      };
    }
  } catch (error) {
    console.error('Error handling RFID scan:', error);
    return { 
      success: false, 
      error: 'ไม่สามารถประมวลผลการสแกน RFID ได้' 
    };
  }
}
