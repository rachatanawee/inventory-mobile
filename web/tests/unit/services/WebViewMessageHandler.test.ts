/**
 * WebViewMessageHandler Unit Tests
 * Tests message handling between Web App and React Native
 * 
 * Requirements: 10.2, 12.1, 12.2, 12.4
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebViewMessageHandler } from '@/lib/services/WebViewMessageHandler';
import { WebViewMessage, RFIDScanResult } from '@/lib/types/product';

describe('WebViewMessageHandler', () => {
  let handler: WebViewMessageHandler;
  let messageListener: ((event: MessageEvent) => void) | null = null;

  beforeEach(() => {
    handler = new WebViewMessageHandler();
    
    // Mock window with proper event handling
    (global as any).window = {
      ReactNativeWebView: {
        postMessage: vi.fn(),
      },
      addEventListener: vi.fn((event: string, listener: any) => {
        if (event === 'message') {
          messageListener = listener;
        }
      }),
      removeEventListener: vi.fn(() => {
        messageListener = null;
      }),
    };
  });

  afterEach(() => {
    handler.cleanup();
    messageListener = null;
  });

  describe('Message Validation', () => {
    test('should accept valid message with type field', () => {
      const message: WebViewMessage = {
        type: 'SCAN_RFID',
      };

      // Access private method through sendToNative which validates
      expect(() => handler.sendToNative(message)).not.toThrow();
    });

    test('should reject message without type field', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const invalidMessage = { payload: 'test' } as any;
      handler.sendToNative(invalidMessage);

      expect(consoleSpy).toHaveBeenCalledWith('Invalid message format:', invalidMessage);
      consoleSpy.mockRestore();
    });

    test('should reject message with invalid type', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const invalidMessage = { type: 'INVALID_TYPE' } as any;
      handler.sendToNative(invalidMessage);

      expect(consoleSpy).toHaveBeenCalledWith('Invalid message format:', invalidMessage);
      consoleSpy.mockRestore();
    });
  });

  describe('Sending Messages to React Native', () => {
    test('should send SCAN_RFID message', () => {
      handler.startRFIDScan();

      expect(window.ReactNativeWebView?.postMessage).toHaveBeenCalledWith(
        JSON.stringify({ type: 'SCAN_RFID' })
      );
    });

    test('should send STOP_SCAN message', () => {
      handler.stopRFIDScan();

      expect(window.ReactNativeWebView?.postMessage).toHaveBeenCalledWith(
        JSON.stringify({ type: 'STOP_SCAN' })
      );
    });

    test('should handle missing ReactNativeWebView gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Remove ReactNativeWebView
      delete (window as any).ReactNativeWebView;

      handler.startRFIDScan();

      expect(consoleSpy).toHaveBeenCalledWith('Not running in React Native WebView');
      consoleSpy.mockRestore();
    });
  });

  describe('Receiving Messages from React Native', () => {
    test('should handle RFID_RESULT message', () => {
      const mockHandler = vi.fn();
      handler.initialize();
      handler.onRFIDResult(mockHandler);

      const result: RFIDScanResult = {
        epc: 'E2801170000002015B8E5B5B',
        tid: '123456',
        rssi: -50,
        timestamp: Date.now(),
      };

      // Simulate message from React Native
      const messageEvent = new MessageEvent('message', {
        data: {
          type: 'RFID_RESULT',
          payload: result,
        },
      });

      messageListener?.(messageEvent);

      expect(mockHandler).toHaveBeenCalledWith(result);
    });

    test('should handle RFID_ERROR message', () => {
      const mockHandler = vi.fn();
      handler.initialize();
      handler.onRFIDError(mockHandler);

      const error = {
        message: 'Scanner not available',
        code: 'SCANNER_ERROR',
      };

      // Simulate message from React Native
      const messageEvent = new MessageEvent('message', {
        data: {
          type: 'RFID_ERROR',
          payload: error,
        },
      });

      messageListener?.(messageEvent);

      expect(mockHandler).toHaveBeenCalledWith(error);
    });

    test('should handle SCANNER_STATUS message', () => {
      const mockHandler = vi.fn();
      handler.initialize();
      handler.onScannerStatus(mockHandler);

      const status = {
        available: true,
        scanning: false,
      };

      // Simulate message from React Native
      const messageEvent = new MessageEvent('message', {
        data: {
          type: 'SCANNER_STATUS',
          payload: status,
        },
      });

      messageListener?.(messageEvent);

      expect(mockHandler).toHaveBeenCalledWith(status);
    });

    test('should ignore invalid messages', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      handler.initialize();

      // Simulate invalid message
      const messageEvent = new MessageEvent('message', {
        data: {
          invalid: 'data',
        },
      });

      messageListener?.(messageEvent);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Handler Registration', () => {
    test('should register and unregister handlers', () => {
      const mockHandler = vi.fn();
      
      handler.registerHandler('RFID_RESULT', mockHandler);
      handler.unregisterHandler('RFID_RESULT');

      // Handler should not be called after unregistering
      handler.initialize();
      const messageEvent = new MessageEvent('message', {
        data: {
          type: 'RFID_RESULT',
          payload: {},
        },
      });

      messageListener?.(messageEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    test('should remove event listeners on cleanup', () => {
      handler.initialize();
      handler.cleanup();

      expect(window.removeEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    });
  });
});
