import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export const Header = ({ title, showBackButton = false, rightComponent }: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View
      className="bg-blue-500 flex-row items-center justify-between px-4 z-10"
      style={{ paddingTop: insets.top, height: 44 + insets.top }}
    >
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity
            className="mr-2 p-2"
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={22} color="white" />
          </TouchableOpacity>
        )}
        <Text className="text-white font-bold text-lg">{title}</Text>
      </View>
      {rightComponent && (
        <View>
          {rightComponent}
        </View>
      )}
    </View>
  );
};
