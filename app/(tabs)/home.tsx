import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-6">
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name || 'User'}!
          </Text>
          <Text className="text-gray-600 mt-2">
            Track expenses with your roommates easily.
          </Text>
        </View>

        <View className="space-y-4">
          <TouchableOpacity 
            className="bg-white rounded-lg p-5 flex-row items-center shadow-sm"
            onPress={() => navigateTo('/(tabs)/rooms')}
          >
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Feather name="users" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Your Rooms</Text>
              <Text className="text-gray-600">Manage your shared expense rooms</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white rounded-lg p-5 flex-row items-center shadow-sm"
            onPress={() => navigateTo('/transactions')}
          >
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
              <Feather name="dollar-sign" size={24} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Transactions</Text>
              <Text className="text-gray-600">View and manage your transactions</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white rounded-lg p-5 flex-row items-center shadow-sm"
            onPress={() => navigateTo('/debts')}
          >
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Feather name="credit-card" size={24} color="#8b5cf6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">Debts</Text>
              <Text className="text-gray-600">Track and settle debts</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
