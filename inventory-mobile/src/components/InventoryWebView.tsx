import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { webViewBridge } from '../services/WebViewBridgeService';

interface InventoryWebViewProps {
  url: string;
  onMessage?: (event: WebViewMessageEvent) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
}

export const InventoryWebView: React.FC<InventoryWebViewProps> = ({
  url,
  onMessage,
  onLoadStart,
  onLoadEnd,
  onError,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize WebViewBridge with ref
  useEffect(() => {
    webViewBridge.setWebViewRef(webViewRef);
    
    return () => {
      webViewBridge.cleanup();
    };
  }, []);

  const handleLoadStart = () => {
    setIsLoading(true);
    setError(null);
    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    onLoadEnd?.();
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setIsLoading(false);
    setError('ไม่สามารถโหลดแอปพลิเคชันได้ กรุณาตรวจสอบการเชื่อมต่อ');
    onError?.(nativeEvent);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    // Route message through WebViewBridge
    webViewBridge.handleFromWeb(event);
    
    // Also call parent handler if provided
    onMessage?.(event);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>กำลังโหลด...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#cc0000',
    textAlign: 'center',
  },
});
