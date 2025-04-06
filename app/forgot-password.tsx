import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { requestPasswordReset } from '../src/api/api';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Header } from '../src/components/Header';
import { LoadingIndicator } from '../src/components/LoadingIndicator';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset(email);
      if (response.token) {
        // Navigate to reset password screen with token
        router.replace({
          pathname: '/reset-password',
          params: { email, token: response.token }
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header title="Forgot Password" showBackButton />
      <ScrollView contentContainerClassName="flex-grow p-6" keyboardShouldPersistTaps="handled">
        <View className="items-center mb-8">
          <Text className="text-gray-600 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
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

          <Button
            title="Send Reset Link"
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
