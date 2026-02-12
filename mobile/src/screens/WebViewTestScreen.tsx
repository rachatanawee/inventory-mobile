/**
 * WebView Test Screen
 * Screen for testing message communication between React Native and WebView
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { webViewBridge } from '../services/WebViewBridgeService';

type RootStackParamList = {
  Home: { searchQuery?: string };
  WebViewTest: undefined;
};

export default function WebViewTestScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [productId, setProductId] = useState('');
  const [rfidTag, setRfidTag] = useState('E2801170000002015B8E5B5B');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp}: ${message}`, ...prev]);
  };

  // Send RFID scan result to WebView
  const sendRFIDResult = () => {
    if (!rfidTag.trim()) {
      addLog('❌ Please enter RFID tag');
      return;
    }

    const result = {
      epc: rfidTag,
      tid: '123456789ABC',
      rssi: -45,
      timestamp: Date.now(),
    };

    webViewBridge.sendRFIDResult(result);
    addLog(`✅ Sent RFID_RESULT: ${rfidTag}`);
  };

  // Send RFID error to WebView
  const sendRFIDError = () => {
    const error = {
      message: 'Scanner not available',
      code: 'SCANNER_ERROR',
    };

    webViewBridge.sendRFIDError(error);
    addLog('❌ Sent RFID_ERROR: Scanner not available');
  };

  // Send scanner status to WebView
  const sendScannerStatus = (isReady: boolean, isScanning: boolean) => {
    webViewBridge.sendScannerStatus({ isReady, isScanning });
    addLog(`📡 Sent SCANNER_STATUS: isReady=${isReady}, isScanning=${isScanning}`);
  };

  // Search product by ID (navigate to Home with search query)
  const searchProduct = () => {
    if (!productId.trim()) {
      addLog('❌ Please enter Product ID');
      return;
    }

    addLog(`🔍 Navigating to search: ${productId}`);
    // Navigate to Home tab with search query
    navigation.navigate('Home', { searchQuery: productId });
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>WebView Test</Text>
        <Text style={styles.subtitle}>ทดสอบการส่งข้อมูลจาก Mobile ไป Web</Text>

        {/* Product Search Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 ค้นหาสินค้า</Text>
          <TextInput
            style={styles.input}
            value={productId}
            onChangeText={setProductId}
            placeholder="Product ID..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.buttonPurple} onPress={searchProduct}>
            <Text style={styles.buttonText}>🔎 ค้นหา Product</Text>
          </TouchableOpacity>
        </View>

        {/* RFID Test Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📡 ทดสอบ RFID</Text>
          <TextInput
            style={styles.input}
            value={rfidTag}
            onChangeText={setRfidTag}
            placeholder="RFID Tag (EPC)..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.buttonGreen} onPress={sendRFIDResult}>
            <Text style={styles.buttonText}>✅ ส่ง RFID Scan Result</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonRed} onPress={sendRFIDError}>
            <Text style={styles.buttonText}>❌ ส่ง RFID Error</Text>
          </TouchableOpacity>
        </View>

        {/* Scanner Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Scanner Status</Text>
          <TouchableOpacity
            style={styles.buttonBlue}
            onPress={() => sendScannerStatus(true, false)}
          >
            <Text style={styles.buttonText}>✅ Scanner Ready</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonBlue}
            onPress={() => sendScannerStatus(true, true)}
          >
            <Text style={styles.buttonText}>🔄 Scanner Scanning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonGray}
            onPress={() => sendScannerStatus(false, false)}
          >
            <Text style={styles.buttonText}>⛔ Scanner Not Ready</Text>
          </TouchableOpacity>
        </View>

        {/* Logs Section */}
        <View style={styles.section}>
          <View style={styles.logHeader}>
            <Text style={styles.sectionTitle}>📋 Logs</Text>
            <TouchableOpacity onPress={clearLogs}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logContainer}>
            {logs.length === 0 ? (
              <Text style={styles.logEmpty}>No logs yet. Try sending a message above.</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} style={styles.logText}>
                  {log}
                </Text>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B262C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#0F4C75',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B262C',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#1B262C',
  },
  buttonPurple: {
    backgroundColor: '#9333ea',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonGreen: {
    backgroundColor: '#22c55e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonRed: {
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonBlue: {
    backgroundColor: '#3282B8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonGray: {
    backgroundColor: '#6b7280',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  logContainer: {
    backgroundColor: '#1B262C',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
  },
  logEmpty: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  logText: {
    color: '#22c55e',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});
