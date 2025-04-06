import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useOffline } from '../context/OfflineContext';

interface OfflineNotificationProps {
  className?: string;
}

export const OfflineNotification = ({ className = '' }: OfflineNotificationProps) => {
  const { isOnline, hasPendingTransactions, offlineTransactionCount, syncOfflineTransactions } = useOffline();

  // Don't render anything if we're online and have no pending transactions
  if (isOnline && !hasPendingTransactions) {
    return null;
  }

  // When offline
  if (!isOnline) {
    return (
      <View className={`bg-red-500 px-4 py-2 ${className}`}>
        <Text className="text-white text-center font-medium">
          You are currently offline. Transactions will be synced when you're back online.
        </Text>
      </View>
    );
  }

  // When online but have pending transactions
  return (
    <View className={`bg-yellow-500 px-4 py-2 flex-row items-center justify-between ${className}`}>
      <Text className="text-white flex-1 font-medium">
        {offlineTransactionCount} transaction{offlineTransactionCount !== 1 ? 's' : ''} pending synchronization
      </Text>
      <TouchableOpacity 
        onPress={syncOfflineTransactions}
        className="bg-white rounded-full p-1"
      >
        <Feather name="refresh-cw" size={16} color="#EAB308" />
      </TouchableOpacity>
    </View>
  );
};