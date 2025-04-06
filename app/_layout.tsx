import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../src/context/AuthContext';
import { LoadingIndicator } from '../src/components/LoadingIndicator';

export default function RootLayout() {
  const { isLoading, isAuthenticated } = useAuth();
  const { colorScheme } = useColorScheme();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" redirect={isAuthenticated} />
        <Stack.Screen name="login" redirect={isAuthenticated} />
        <Stack.Screen name="signup" redirect={isAuthenticated} />
        <Stack.Screen name="forgot-password" redirect={isAuthenticated} />
        <Stack.Screen name="reset-password" redirect={isAuthenticated} />
        <Stack.Screen name="verify-email" redirect={isAuthenticated} />
        <Stack.Screen name="(tabs)" redirect={!isAuthenticated} />
        <Stack.Screen name="add-transaction" redirect={!isAuthenticated} />
        <Stack.Screen name="transactions" redirect={!isAuthenticated} />
        <Stack.Screen name="debts" redirect={!isAuthenticated} />
      </Stack>
    </>
  );
}
