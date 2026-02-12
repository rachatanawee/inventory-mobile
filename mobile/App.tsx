/**
 * Inventory Mobile App
 * React Native app with WebView for inventory management
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff" 
        translucent={false}
      />
      <AppNavigator />
    </>
  );
}

export default App;
