import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoadingIndicatorProps {
  text?: string;
}

export const LoadingIndicator = ({ text = 'Loading...' }: LoadingIndicatorProps) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      <View className="p-6 rounded-lg items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4 font-medium">{text}</Text>
      </View>
    </SafeAreaView>
  );
};
