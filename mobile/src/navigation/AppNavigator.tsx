/**
 * App Navigator
 * Bottom tab navigation for the app
 */

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import WebViewTestScreen from '../screens/WebViewTestScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3282B8',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#e0e0e0',
            borderTopWidth: 1,
            paddingBottom: 8,
            height: 60,
          },
          headerShown: false, // ซ่อน header
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'หน้าหลัก',
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="WebViewTest"
          component={WebViewTestScreen}
          options={{
            tabBarLabel: 'ทดสอบ',
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="test" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Simple icon component (can be replaced with react-native-vector-icons later)
function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const icons: Record<string, string> = {
    home: '🏠',
    test: '🧪',
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {icons[name] || '•'}
    </Text>
  );
}
