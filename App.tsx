import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import TestScreen from './app/test';

// Simplified version to bypass potential issues with expo-router
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <TestScreen />
    </SafeAreaProvider>
  );
}
