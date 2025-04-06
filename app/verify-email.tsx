import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { verifyEmail } from '../src/api/api';
import { useAuth } from '../src/context/AuthContext';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Header } from '../src/components/Header';
import { LoadingIndicator } from '../src/components/LoadingIndicator';

export default function VerifyEmailScreen() {
  const { token: defaultToken } = useLocalSearchParams<{ token: string }>();
  const [token, setToken] = useState(defaultToken || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUserAndToken } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'Please enter the verification token');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyEmail(token);
      // Set user data and token
      setUserAndToken(response.user, response.token);
      // Redirect to home
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header title="Verify Email" showBackButton />
      <ScrollView contentContainerClassName="flex-grow p-6" keyboardShouldPersistTaps="handled">
        <View className="items-center mb-8">
          <Text className="text-gray-600 text-center">
            Please enter the verification token sent to your email.
          </Text>
        </View>

        <View className="space-y-4">
          <Input
            label="Verification Token"
            value={token}
            onChangeText={setToken}
            placeholder="Enter verification token"
            autoCapitalize="none"
          />

          <Button
            title="Verify Email"
            onPress={handleSubmit}
            disabled={isSubmitting}
          />

          <View className="flex-row justify-center mt-4">
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-500">Back to Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
