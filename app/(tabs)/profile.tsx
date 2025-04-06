import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // AuthContext will handle redirection
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to logout');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-6">
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6 items-center">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
            {user?.profile_pic ? (
              <Image 
                source={{ uri: user.profile_pic }} 
                className="w-full h-full rounded-full" 
              />
            ) : (
              <Feather name="user" size={40} color="#3b82f6" />
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</Text>
          <Text className="text-gray-500">{user?.type || 'User'}</Text>
        </View>

        <View className="bg-white rounded-lg shadow-sm mb-6">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-800">Account Information</Text>
          </View>
          
          <View className="p-4 flex-row items-center">
            <Feather name="mail" size={20} color="#6b7280" className="mr-3" />
            <View>
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="text-gray-800">{user?.email || 'No email provided'}</Text>
            </View>
          </View>
          
          <View className="p-4 flex-row items-center">
            <Feather name="phone" size={20} color="#6b7280" className="mr-3" />
            <View>
              <Text className="text-gray-500 text-sm">Phone</Text>
              <Text className="text-gray-800">{user?.phone || 'No phone provided'}</Text>
            </View>
          </View>
          
          <View className="p-4 flex-row items-center">
            <Feather name="user" size={20} color="#6b7280" className="mr-3" />
            <View>
              <Text className="text-gray-500 text-sm">Account Type</Text>
              <Text className="text-gray-800">{user?.type === 'admin' ? 'Administrator' : 'User'}</Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Button 
            title="Logout" 
            onPress={handleLogout}
            className="bg-red-500"
          />
        </View>
      </View>
    </ScrollView>
  );
}
