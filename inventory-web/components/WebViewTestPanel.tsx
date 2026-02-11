/**
 * WebView Test Panel
 * Component for testing WebView message communication in browser
 * Only visible in development mode
 */

'use client';

import { useState } from 'react';
import { webViewMessageHandler } from '@/lib/services/WebViewMessageHandler';

export default function WebViewTestPanel() {
  const [lastMessage, setLastMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Simulate RFID scan result from React Native
  const simulateRFIDResult = () => {
    const mockResult = {
      epc: 'E2801170000002015B8E5B5B',
      tid: '123456789ABC',
      rssi: -45,
      timestamp: Date.now(),
    };

    // Simulate message from React Native
    const event = new MessageEvent('message', {
      data: {
        type: 'RFID_RESULT',
        payload: mockResult,
      },
    });
    window.dispatchEvent(event);

    setLastMessage(`RFID_RESULT: ${mockResult.epc}`);
  };

  // Simulate RFID error from React Native
  const simulateRFIDError = () => {
    const mockError = {
      message: 'Scanner not available',
      code: 'SCANNER_ERROR',
    };

    // Simulate message from React Native
    const event = new MessageEvent('message', {
      data: {
        type: 'RFID_ERROR',
        payload: mockError,
      },
    });
    window.dispatchEvent(event);

    setLastMessage(`RFID_ERROR: ${mockError.message}`);
  };

  // Simulate scanner status from React Native
  const simulateScannerStatus = (available: boolean, scanning: boolean) => {
    const mockStatus = {
      available,
      scanning,
    };

    // Simulate message from React Native
    const event = new MessageEvent('message', {
      data: {
        type: 'SCANNER_STATUS',
        payload: mockStatus,
      },
    });
    window.dispatchEvent(event);

    setLastMessage(`SCANNER_STATUS: available=${available}, scanning=${scanning}`);
  };

  // Send SCAN_RFID to React Native (will log in console)
  const sendScanRFID = () => {
    webViewMessageHandler.startRFIDScan();
    setLastMessage('Sent: SCAN_RFID');
  };

  // Send STOP_SCAN to React Native (will log in console)
  const sendStopScan = () => {
    webViewMessageHandler.stopRFIDScan();
    setLastMessage('Sent: STOP_SCAN');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 px-4 py-2 bg-[#3282B8] text-white rounded-lg shadow-lg hover:bg-[#0F4C75] text-sm font-medium"
      >
        {isVisible ? '🔽 ซ่อน Test Panel' : '🔼 WebView Test (คลิกเพื่อทดสอบ RFID)'}
      </button>

      {/* Test Panel */}
      {isVisible && (
        <div className="bg-white rounded-lg shadow-2xl p-4 w-80 border-2 border-[#3282B8]">
          <h3 className="text-lg font-bold mb-3 text-[#1B262C]">
            WebView Message Test
          </h3>

          {/* Last Message Display */}
          {lastMessage && (
            <div className="mb-3 p-2 bg-[#BBE1FA] rounded text-xs font-mono text-[#1B262C] break-all">
              {lastMessage}
            </div>
          )}

          {/* Simulate Messages FROM React Native */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#0F4C75] mb-2">
              ← จำลองข้อความจาก React Native:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => simulateScannerStatus(true, false)}
                className="w-full px-3 py-2 bg-[#3282B8] text-white rounded text-sm hover:bg-[#0F4C75] font-medium"
              >
                ✅ เปิดใช้งาน RFID Scanner
              </button>
              <button
                onClick={simulateRFIDResult}
                className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                📡 จำลองสแกน RFID สำเร็จ
              </button>
              <button
                onClick={simulateRFIDError}
                className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                ❌ จำลอง RFID Error
              </button>
              <button
                onClick={() => simulateScannerStatus(false, false)}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                ⛔ ปิดใช้งาน Scanner
              </button>
            </div>
          </div>

          {/* Send Messages TO React Native */}
          <div>
            <p className="text-xs font-semibold text-[#0F4C75] mb-2">
              → ส่งข้อความไปยัง React Native:
            </p>
            <div className="space-y-2">
              <button
                onClick={sendScanRFID}
                className="w-full px-3 py-2 bg-[#0F4C75] text-white rounded text-sm hover:bg-[#1B262C]"
              >
                🚀 เริ่มสแกน
              </button>
              <button
                onClick={sendStopScan}
                className="w-full px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
              >
                ⏹ หยุดสแกน
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#0F4C75] italic">
            เปิด browser console เพื่อดูข้อความ
          </p>
        </div>
      )}
    </div>
  );
}
