/**
 * Inventory Mobile App
 * React Native app with WebView for inventory management
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InventoryWebView } from './src/components/InventoryWebView';
import { SplashScreen } from './src/components/SplashScreen';
import type { WebViewMessageEvent } from 'react-native-webview';
import Config from './src/config/app.config';
import { webViewBridge } from './src/services/WebViewBridgeService';

// Web app URL - automatically switches between dev and production
const WEB_APP_URL = Config.WEB_APP_URL;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup WebViewBridge message handlers
  useEffect(() => {
    // Handle SCAN_RFID request from web
    webViewBridge.handleScanRequest(() => {
      console.log('Starting RFID scan...');
      // RFID scanning will be implemented in later tasks
      // For now, just log the request
    });

    // Handle STOP_SCAN request from web
    webViewBridge.handleStopScanRequest(() => {
      console.log('Stopping RFID scan...');
      // RFID scanning will be implemented in later tasks
      // For now, just log the request
    });

    return () => {
      webViewBridge.cleanup();
    };
  }, []);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    // Hide splash screen after WebView loads
    setTimeout(() => {
      setShowSplash(false);
    }, 500);
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setError('ไม่สามารถโหลดแอปพลิเคชันได้');
    console.error('WebView Error:', error);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    // Messages are now handled by WebViewBridge
    // This handler is kept for backward compatibility
    console.log('Message received:', event.nativeEvent.data);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        {/* WebView loads in background */}
        <InventoryWebView
          url={WEB_APP_URL}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onMessage={handleMessage}
        />
        
        {/* Show splash screen on top while loading */}
        {showSplash && (
          <View style={styles.splashContainer}>
            <SplashScreen appName="Inventory System" />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

export default App;
