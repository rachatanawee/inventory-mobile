/**
 * Splash Screen Component
 * Displays app name and company branding
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

interface SplashScreenProps {
  appName?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  appName = 'InventoryMobile',
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      
      {/* App Name */}
      <View style={styles.content}>
        <Text style={styles.appName}>{appName}</Text>
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={styles.loader}
        />
      </View>

      {/* Company Branding */}
      <View style={styles.footer}>
        <Text style={styles.byText}>by CSI Group</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb', // Blue background
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  byText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '300',
  },
});
