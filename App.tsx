import 'react-native-gesture-handler';
import React, { useEffect, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ExpoRoot } from 'expo-router';
import { AuthProvider } from './src/context/AuthContext';
import { OfflineProvider } from './src/context/OfflineContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OfflineProvider>
          <StatusBar style="auto" />
          <ExpoRoot context={require.context('./app')} />
        </OfflineProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
