/**
 * WebViewBridgeService
 * Handles communication between React Native and Web Application
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4
 */

import { RefObject } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import type {
  WebViewMessage,
  WebViewMessageType,
  RFIDScanResult,
  ScannerStatus,
  WebViewBridgeError,
} from '../types/webview.types';

export class WebViewBridgeService {
  private webViewRef: RefObject<WebView> | null = null;
  private messageHandlers: Map<WebViewMessageType, (payload: any) => void> = new Map();

  /**
   * Initialize the bridge with a WebView reference
   */
  setWebViewRef(ref: RefObject<WebView>): void {
    this.webViewRef = ref;
  }

  /**
   * Register a message handler for a specific message type
   */
  registerHandler(type: WebViewMessageType, handler: (payload: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Unregister a message handler
   */
  unregisterHandler(type: WebViewMessageType): void {
    this.messageHandlers.delete(type);
  }

  /**
   * Send message to Web Application
   * Requirement 12.1: React Native sends message to Web
   */
  sendToWeb(message: WebViewMessage): void {
    if (!this.webViewRef?.current) {
      console.error('WebView reference not set');
      return;
    }

    // Validate message format (Requirement 12.4)
    if (!this.validateMessage(message)) {
      console.error('Invalid message format:', message);
      return;
    }

    try {
      const messageString = JSON.stringify(message);
      const jsCode = `
        (function() {
          try {
            window.postMessage(${messageString}, '*');
          } catch (error) {
            console.error('Failed to receive message from React Native:', error);
          }
        })();
      `;
      
      this.webViewRef.current.injectJavaScript(jsCode);
    } catch (error) {
      console.error('Failed to send message to web:', error);
    }
  }

  /**
   * Handle message from Web Application
   * Requirement 12.2: Web sends message to React Native
   */
  handleFromWeb(event: WebViewMessageEvent): void {
    try {
      const data = event.nativeEvent.data;
      const message: WebViewMessage = JSON.parse(data);

      // Validate message format (Requirement 12.4)
      if (!this.validateMessage(message)) {
        console.error('Invalid message format received from web:', message);
        return;
      }

      // Route message to appropriate handler
      this.routeMessage(message);
    } catch (error) {
      console.error('Failed to parse message from web:', error);
    }
  }

  /**
   * Validate message format
   * Requirement 12.4: Message must be valid JSON with type field
   */
  private validateMessage(message: any): message is WebViewMessage {
    if (!message || typeof message !== 'object') {
      return false;
    }

    if (!message.type || typeof message.type !== 'string') {
      return false;
    }

    const validTypes: WebViewMessageType[] = [
      'SCAN_RFID',
      'STOP_SCAN',
      'RFID_RESULT',
      'RFID_ERROR',
      'SCANNER_STATUS',
    ];

    return validTypes.includes(message.type);
  }

  /**
   * Route message to appropriate handler
   * Requirement 12.3: Handle message types (SCAN_RFID, STOP_SCAN)
   */
  private routeMessage(message: WebViewMessage): void {
    const handler = this.messageHandlers.get(message.type);
    
    if (handler) {
      handler(message.payload);
    } else {
      console.warn(`No handler registered for message type: ${message.type}`);
    }
  }

  /**
   * Send RFID scan result to Web Application
   * Requirement 10.2: Send RFID_RESULT message to web
   */
  sendRFIDResult(result: RFIDScanResult): void {
    this.sendToWeb({
      type: 'RFID_RESULT',
      payload: result,
    });
  }

  /**
   * Send RFID error to Web Application
   * Requirement 11.4: Send RFID_ERROR message to web
   */
  sendRFIDError(error: WebViewBridgeError): void {
    this.sendToWeb({
      type: 'RFID_ERROR',
      payload: error,
    });
  }

  /**
   * Send scanner status to Web Application
   * Requirement 11.2, 11.3: Send scanner status updates
   */
  sendScannerStatus(status: ScannerStatus): void {
    this.sendToWeb({
      type: 'SCANNER_STATUS',
      payload: status,
    });
  }

  /**
   * Handle SCAN_RFID message from web
   * Requirement 12.3: Handle SCAN_RFID message type
   */
  handleScanRequest(callback: () => void): void {
    this.registerHandler('SCAN_RFID', () => {
      console.log('Received SCAN_RFID request from web');
      callback();
    });
  }

  /**
   * Handle STOP_SCAN message from web
   * Requirement 12.3: Handle STOP_SCAN message type
   */
  handleStopScanRequest(callback: () => void): void {
    this.registerHandler('STOP_SCAN', () => {
      console.log('Received STOP_SCAN request from web');
      callback();
    });
  }

  /**
   * Clean up handlers
   */
  cleanup(): void {
    this.messageHandlers.clear();
    this.webViewRef = null;
  }
}

// Export singleton instance
export const webViewBridge = new WebViewBridgeService();
