'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WebViewTestPage() {
  const [isInWebView, setIsInWebView] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [productId, setProductId] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if running in WebView
    const inWebView = typeof window !== 'undefined' && !!(window as any).ReactNativeWebView;
    setIsInWebView(inWebView);
    addResult(`Running in WebView: ${inWebView ? 'Yes ✅' : 'No ❌'}`);
  }, []);

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `${timestamp}: ${message}`]);
  };

  const testPostMessage = () => {
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      try {
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
          type: 'TEST_MESSAGE',
          payload: { message: 'Hello from Web!' }
        }));
        addResult('Sent test message to React Native ✅');
      } catch (error) {
        addResult(`Error sending message: ${error} ❌`);
      }
    } else {
      addResult('Not in WebView - cannot send message ❌');
    }
  };

  const testScanRFID = () => {
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      try {
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SCAN_RFID'
        }));
        addResult('Sent SCAN_RFID command ✅');
      } catch (error) {
        addResult(`Error sending SCAN_RFID: ${error} ❌`);
      }
    } else {
      addResult('Not in WebView - cannot send SCAN_RFID ❌');
    }
  };

  const testStopScan = () => {
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      try {
        (window as any).ReactNativeWebView.postMessage(JSON.stringify({
          type: 'STOP_SCAN'
        }));
        addResult('Sent STOP_SCAN command ✅');
      } catch (error) {
        addResult(`Error sending STOP_SCAN: ${error} ❌`);
      }
    } else {
      addResult('Not in WebView - cannot send STOP_SCAN ❌');
    }
  };

  const searchProduct = () => {
    if (!productId.trim()) {
      addResult('Please enter a product ID ❌');
      return;
    }
    
    addResult(`Searching for product ID: ${productId} 🔍`);
    // Use window.location for faster navigation
    window.location.href = `/?search=${encodeURIComponent(productId)}`;
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">WebView Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment</h2>
          <div className="space-y-2">
            <p className="text-lg">
              Status: {isInWebView ? (
                <span className="text-green-600 font-semibold">Running in WebView ✅</span>
              ) : (
                <span className="text-red-600 font-semibold">Running in Browser ❌</span>
              )}
            </p>
            <p className="text-sm text-gray-600 break-all">
              User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Product Search</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && searchProduct()}
            />
            <button
              onClick={searchProduct}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Search Product by ID
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={testPostMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Send Test Message
            </button>
            <button
              onClick={testScanRFID}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Test SCAN_RFID Command
            </button>
            <button
              onClick={testStopScan}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Test STOP_SCAN Command
            </button>
            <button
              onClick={clearResults}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Clear Results
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No results yet. Click a test button above.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
