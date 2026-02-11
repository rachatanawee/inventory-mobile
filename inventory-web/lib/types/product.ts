/**
 * Core data types for the Inventory System
 * Requirements: 1.1, 2.1
 */

export interface Product {
  id: string;           // UUID for unique identification
  name: string;         // Product name (must not be empty)
  quantity: number;     // Stock quantity (must be >= 0)
  rfidTag?: string;     // Optional RFID EPC/TID
  createdAt: number;    // Timestamp when product was created
  updatedAt: number;    // Timestamp when product was last updated
}

export interface ProductInput {
  name: string;
  quantity: number;
  rfidTag?: string;
}

export interface RFIDScanResult {
  epc: string;          // Electronic Product Code
  tid?: string;         // Tag Identifier
  rssi?: number;        // Signal strength
  timestamp: number;
}

export interface WebViewMessage {
  type: 'SCAN_RFID' | 'STOP_SCAN' | 'RFID_RESULT' | 'RFID_ERROR';
  payload?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
