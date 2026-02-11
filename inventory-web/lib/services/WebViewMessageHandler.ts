/**
 * WebView Message Handler
 * Handles communication between Web Application and React Native
 * 
 * Requirements: 10.2, 12.1, 12.2
 */

import { WebViewMessage, RFIDScanResult } from '@/lib/types/product';

export type MessageHandler = (payload: unknown) => void;

export class WebViewMessageHandler {
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private isInitialized = false;

  /**
   * Initialize the message handler
   * Sets up listener for messages from React Native
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Listen for messages from React Native
    // Requirement 12.2: Web receives message from React Native
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage);
      this.isInitialized = true;
    }
  }

  /**
   * Clean up event listeners
   */
  cleanup(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleMessage);
      this.isInitialized = false;
    }
    this.messageHandlers.clear();
  }

  /**
   * Handle incoming message from React Native
   * Requirement 10.2: Receive RFID_RESULT, RFID_ERROR, scanner status
   */
  private handleMessage = (event: MessageEvent): void => {
    try {
      // Parse message
      const message: WebViewMessage = event.data;

      // Validate message format (Requirement 12.4)
      if (!this.validateMessage(message)) {
        console.error('Invalid message format:', message);
        return;
      }

      // Route to appropriate handler
      this.routeMessage(message);
    } catch (error) {
      console.error('Failed to handle message from React Native:', error);
    }
  };

  /**
   * Validate message format
   * Requirement 12.4: Message must have type field
   */
  private validateMessage(message: unknown): message is WebViewMessage {
    if (!message || typeof message !== 'object') {
      return false;
    }

    const msg = message as Record<string, unknown>;

    if (!msg.type || typeof msg.type !== 'string') {
      return false;
    }

    const validTypes = [
      'SCAN_RFID',
      'STOP_SCAN',
      'RFID_RESULT',
      'RFID_ERROR',
      'SCANNER_STATUS',
    ];

    return validTypes.includes(msg.type);
  }

  /**
   * Route message to registered handler
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
   * Register a handler for a specific message type
   */
  registerHandler(type: string, handler: MessageHandler): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Unregister a handler
   */
  unregisterHandler(type: string): void {
    this.messageHandlers.delete(type);
  }

  /**
   * Send message to React Native
   * Requirement 12.1: Web sends message to React Native
   */
  sendToNative(message: WebViewMessage): void {
    if (typeof window === 'undefined') {
      console.error('Window is not available');
      return;
    }

    // Validate message format
    if (!this.validateMessage(message)) {
      console.error('Invalid message format:', message);
      return;
    }

    try {
      // Check if running in React Native WebView
      if (window.ReactNativeWebView) {
        // Send via React Native WebView postMessage
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      } else {
        console.warn('Not running in React Native WebView');
      }
    } catch (error) {
      console.error('Failed to send message to React Native:', error);
    }
  }

  /**
   * Send SCAN_RFID command to React Native
   * Requirement 10.2: Send SCAN_RFID message
   */
  startRFIDScan(): void {
    this.sendToNative({
      type: 'SCAN_RFID',
    });
  }

  /**
   * Send STOP_SCAN command to React Native
   * Requirement 10.2: Send STOP_SCAN message
   */
  stopRFIDScan(): void {
    this.sendToNative({
      type: 'STOP_SCAN',
    });
  }

  /**
   * Register handler for RFID scan results
   * Requirement 10.2: Receive RFID_RESULT from React Native
   */
  onRFIDResult(handler: (result: RFIDScanResult) => void): void {
    this.registerHandler('RFID_RESULT', (payload: unknown) => {
      handler(payload as RFIDScanResult);
    });
  }

  /**
   * Register handler for RFID errors
   * Requirement 10.2: Receive RFID_ERROR from React Native
   */
  onRFIDError(handler: (error: { message: string; code?: string }) => void): void {
    this.registerHandler('RFID_ERROR', (payload: unknown) => {
      handler(payload as { message: string; code?: string });
    });
  }

  /**
   * Register handler for scanner status updates
   * Requirement 10.2: Receive scanner status from React Native
   */
  onScannerStatus(handler: (status: { available: boolean; scanning: boolean }) => void): void {
    this.registerHandler('SCANNER_STATUS', (payload: unknown) => {
      handler(payload as { available: boolean; scanning: boolean });
    });
  }
}

// Export singleton instance
export const webViewMessageHandler = new WebViewMessageHandler();

// Type declaration for React Native WebView
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
