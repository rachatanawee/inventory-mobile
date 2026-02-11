/**
 * WebView Message Types
 * Types for communication between React Native and Web Application
 */

export type WebViewMessageType = 
  | 'SCAN_RFID'      // Web -> RN: Request to start RFID scanning
  | 'STOP_SCAN'      // Web -> RN: Request to stop RFID scanning
  | 'RFID_RESULT'    // RN -> Web: RFID scan result
  | 'RFID_ERROR'     // RN -> Web: RFID scan error
  | 'SCANNER_STATUS'; // RN -> Web: Scanner status update

export interface WebViewMessage {
  type: WebViewMessageType;
  payload?: any;
}

export interface RFIDScanResult {
  epc: string;           // Electronic Product Code
  tid?: string;          // Tag Identifier
  rssi?: number;         // Signal strength
  timestamp: number;
}

export interface ScannerStatus {
  isReady: boolean;
  isScanning: boolean;
  error?: string;
}

export interface WebViewBridgeError {
  code: string;
  message: string;
  details?: any;
}
