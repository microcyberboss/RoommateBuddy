import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { LoadingIndicator } from '../src/components/LoadingIndicator';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      // Auth context will handle redirection
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerClassName="flex-grow p-6" keyboardShouldPersistTaps="handled">
        <View className="items-center mb-10 mt-10">
          <Text className="text-3xl font-bold text-blue-500">FinTrack</Text>
          <Text className="text-gray-600 mt-2 text-center">Roommate expense tracking made easy</Text>
        </View>

        <View className="space-y-4">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
          />

          <Button
            title="Log In"
            onPress={handleLogin}
            disabled={isSubmitting}
          />

          <View className="flex-row justify-between mt-4">
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text className="text-blue-500">Create Account</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
                <Text className="text-blue-500">Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
