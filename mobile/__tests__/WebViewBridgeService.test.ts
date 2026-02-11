/**
 * WebViewBridgeService Tests
 * Tests for WebView communication bridge
 */

import { WebViewBridgeService } from '../src/services/WebViewBridgeService';
import type { WebViewMessage, RFIDScanResult, ScannerStatus } from '../src/types/webview.types';

describe('WebViewBridgeService', () => {
  let bridge: WebViewBridgeService;
  let mockWebViewRef: any;

  beforeEach(() => {
    bridge = new WebViewBridgeService();
    mockWebViewRef = {
      current: {
        injectJavaScript: jest.fn(),
      },
    };
    bridge.setWebViewRef(mockWebViewRef);
  });

  afterEach(() => {
    bridge.cleanup();
  });

  describe('Message Validation', () => {
    test('should validate valid message format', () => {
      const validMessage: WebViewMessage = {
        type: 'SCAN_RFID',
        payload: {},
      };

      // Access private method through any cast for testing
      const isValid = (bridge as any).validateMessage(validMessage);
      expect(isValid).toBe(true);
    });

    test('should reject message without type field', () => {
      const invalidMessage = {
        payload: {},
      };

      const isValid = (bridge as any).validateMessage(invalidMessage);
      expect(isValid).toBe(false);
    });

    test('should reject message with invalid type', () => {
      const invalidMessage = {
        type: 'INVALID_TYPE',
        payload: {},
      };

      const isValid = (bridge as any).validateMessage(invalidMessage);
      expect(isValid).toBe(false);
    });

    test('should reject non-object message', () => {
      const isValid = (bridge as any).validateMessage('not an object');
      expect(isValid).toBe(false);
    });
  });

  describe('sendToWeb', () => {
    test('should send valid message to web', () => {
      const message: WebViewMessage = {
        type: 'RFID_RESULT',
        payload: { epc: 'TEST123', timestamp: Date.now() },
      };

      bridge.sendToWeb(message);

      expect(mockWebViewRef.current.injectJavaScript).toHaveBeenCalled();
      const injectedCode = mockWebViewRef.current.injectJavaScript.mock.calls[0][0];
      expect(injectedCode).toContain('window.postMessage');
      expect(injectedCode).toContain('RFID_RESULT');
    });

    test('should not send invalid message', () => {
      const invalidMessage = {
        type: 'INVALID_TYPE',
      } as any;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      bridge.sendToWeb(invalidMessage);

      expect(mockWebViewRef.current.injectJavaScript).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Invalid message format:', invalidMessage);
      consoleSpy.mockRestore();
    });

    test('should handle missing WebView ref', () => {
      bridge.setWebViewRef({ current: null });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const message: WebViewMessage = { type: 'SCAN_RFID' };
      bridge.sendToWeb(message);

      expect(consoleSpy).toHaveBeenCalledWith('WebView reference not set');
      consoleSpy.mockRestore();
    });
  });

  describe('handleFromWeb', () => {
    test('should handle valid message from web', () => {
      const handler = jest.fn();
      bridge.registerHandler('SCAN_RFID', handler);

      const event = {
        nativeEvent: {
          data: JSON.stringify({ type: 'SCAN_RFID', payload: { test: true } }),
        },
      } as any;

      bridge.handleFromWeb(event);

      expect(handler).toHaveBeenCalledWith({ test: true });
    });

    test('should reject invalid JSON from web', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const event = {
        nativeEvent: {
          data: 'invalid json',
        },
      } as any;

      bridge.handleFromWeb(event);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should reject invalid message format from web', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const event = {
        nativeEvent: {
          data: JSON.stringify({ invalid: 'message' }),
        },
      } as any;

      bridge.handleFromWeb(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Invalid message format received from web:',
        expect.any(Object)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Message Handlers', () => {
    test('should register and call SCAN_RFID handler', () => {
      const handler = jest.fn();
      bridge.handleScanRequest(handler);

      const event = {
        nativeEvent: {
          data: JSON.stringify({ type: 'SCAN_RFID' }),
        },
      } as any;

      bridge.handleFromWeb(event);

      expect(handler).toHaveBeenCalled();
    });

    test('should register and call STOP_SCAN handler', () => {
      const handler = jest.fn();
      bridge.handleStopScanRequest(handler);

      const event = {
        nativeEvent: {
          data: JSON.stringify({ type: 'STOP_SCAN' }),
        },
      } as any;

      bridge.handleFromWeb(event);

      expect(handler).toHaveBeenCalled();
    });

    test('should unregister handler', () => {
      const handler = jest.fn();
      bridge.registerHandler('SCAN_RFID', handler);
      bridge.unregisterHandler('SCAN_RFID');

      const event = {
        nativeEvent: {
          data: JSON.stringify({ type: 'SCAN_RFID' }),
        },
      } as any;

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      bridge.handleFromWeb(event);

      expect(handler).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'No handler registered for message type: SCAN_RFID'
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Helper Methods', () => {
    test('should send RFID result', () => {
      const result: RFIDScanResult = {
        epc: 'TEST123',
        tid: 'TID456',
        rssi: -50,
        timestamp: Date.now(),
      };

      bridge.sendRFIDResult(result);

      expect(mockWebViewRef.current.injectJavaScript).toHaveBeenCalled();
      const injectedCode = mockWebViewRef.current.injectJavaScript.mock.calls[0][0];
      expect(injectedCode).toContain('RFID_RESULT');
      expect(injectedCode).toContain('TEST123');
    });

    test('should send RFID error', () => {
      const error = {
        code: 'SCAN_ERROR',
        message: 'Failed to scan',
      };

      bridge.sendRFIDError(error);

      expect(mockWebViewRef.current.injectJavaScript).toHaveBeenCalled();
      const injectedCode = mockWebViewRef.current.injectJavaScript.mock.calls[0][0];
      expect(injectedCode).toContain('RFID_ERROR');
      expect(injectedCode).toContain('SCAN_ERROR');
    });

    test('should send scanner status', () => {
      const status: ScannerStatus = {
        isReady: true,
        isScanning: false,
      };

      bridge.sendScannerStatus(status);

      expect(mockWebViewRef.current.injectJavaScript).toHaveBeenCalled();
      const injectedCode = mockWebViewRef.current.injectJavaScript.mock.calls[0][0];
      expect(injectedCode).toContain('SCANNER_STATUS');
    });
  });

  describe('cleanup', () => {
    test('should clear all handlers and refs', () => {
      bridge.registerHandler('SCAN_RFID', jest.fn());
      bridge.registerHandler('STOP_SCAN', jest.fn());

      bridge.cleanup();

      // Verify handlers are cleared
      const event = {
        nativeEvent: {
          data: JSON.stringify({ type: 'SCAN_RFID' }),
        },
      } as any;

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      bridge.handleFromWeb(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'No handler registered for message type: SCAN_RFID'
      );
      consoleSpy.mockRestore();
    });
  });
});
