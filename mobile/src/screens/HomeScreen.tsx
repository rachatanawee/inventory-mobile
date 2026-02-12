/**
 * Home Screen
 * Main screen with WebView for inventory management
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp, NavigationProp } from '@react-navigation/native';
import { InventoryWebView } from '../components/InventoryWebView';
import { SplashScreen } from '../components/SplashScreen';
import type { WebViewMessageEvent } from 'react-native-webview';
import WebView from 'react-native-webview';
import Config from '../config/app.config';
import { webViewBridge } from '../services/WebViewBridgeService';

const WEB_APP_URL = Config.WEB_APP_URL;

type RootStackParamList = {
  Home: { searchQuery?: string };
  WebViewTest: undefined;
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const route = useRoute<HomeScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState(WEB_APP_URL);

  // Handle search query from navigation params
  useEffect(() => {
    if (route.params?.searchQuery && webViewRef.current) {
      const searchQuery = route.params.searchQuery;
      console.log('Searching for:', searchQuery);
      
      // Inject JavaScript to set search query and trigger search
      const jsCode = `
        (function() {
          try {
            const searchInput = document.querySelector('input[placeholder*="ค้นหา"]');
            if (searchInput) {
              // Set the value
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
              nativeInputValueSetter.call(searchInput, "${searchQuery}");
              
              // Trigger React's onChange event
              const event = new Event('input', { bubbles: true });
              searchInput.dispatchEvent(event);
              
              // Also trigger change event
              const changeEvent = new Event('change', { bubbles: true });
              searchInput.dispatchEvent(changeEvent);
              
              // Scroll to top to see results
              window.scrollTo(0, 0);
              
              console.log('Search query set successfully');
            } else {
              console.log('Search input not found');
            }
          } catch (error) {
            console.error('Failed to set search query:', error);
          }
        })();
      `;
      
      // Wait a bit for page to load before injecting
      setTimeout(() => {
        webViewRef.current?.injectJavaScript(jsCode);
      }, 800);
      
      // Clear the navigation params
      navigation.setParams({ searchQuery: undefined });
    }
  }, [route.params?.searchQuery]);

  // Setup WebViewBridge message handlers
  useEffect(() => {
    // Set WebView ref for bridge
    if (webViewRef.current) {
      webViewBridge.setWebViewRef(webViewRef);
    }

    // Handle SCAN_RFID request from web
    webViewBridge.handleScanRequest(() => {
      console.log('Starting RFID scan...');
      // RFID scanning will be implemented in later tasks
    });

    // Handle STOP_SCAN request from web
    webViewBridge.handleStopScanRequest(() => {
      console.log('Stopping RFID scan...');
      // RFID scanning will be implemented in later tasks
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
    console.log('Message received:', event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      <InventoryWebView
        ref={webViewRef}
        url={currentUrl}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onMessage={handleMessage}
      />
      
      {showSplash && (
        <View style={styles.splashContainer}>
          <SplashScreen appName="Inventory System" />
        </View>
      )}
    </View>
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
