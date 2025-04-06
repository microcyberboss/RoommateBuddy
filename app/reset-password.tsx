import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { resetPassword } from '../src/api/api';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Header } from '../src/components/Header';
import { LoadingIndicator } from '../src/components/LoadingIndicator';

export default function ResetPasswordScreen() {
  const { email, token } = useLocalSearchParams<{ email: string; token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!email || !token) {
      Alert.alert('Error', 'Missing email or token');
      router.replace('/forgot-password');
    }
  }, [email, token]);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email as string, token as string, password, confirmPassword);
      Alert.alert('Success', 'Your password has been reset successfully', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header title="Reset Password" showBackButton />
      <ScrollView contentContainerClassName="flex-grow p-6" keyboardShouldPersistTaps="handled">
        <View className="items-center mb-8">
          <Text className="text-gray-600 text-center">
            Enter your new password below.
          </Text>
        </View>

        <View className="space-y-4">
          <Input
            label="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter new password"
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm new password"
          />

          <Button
            title="Reset Password"
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
