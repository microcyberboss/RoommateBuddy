import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Room } from '../api/types';

interface RoomItemProps {
  room: Room;
  onAddTransaction: () => void;
}

export const RoomItem = ({ room, onAddTransaction }: RoomItemProps) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{room.name}</Text>
          <Text className="text-gray-500 mt-1">Room ID: {room.id}</Text>
          
          {room.users && room.users.length > 0 && (
            <View className="mt-2">
              <Text className="text-gray-600 text-sm">Members:</Text>
              <View className="flex-row flex-wrap mt-1">
                {room.users.map((user, index) => (
                  <View 
                    key={user.id}
                    className="bg-gray-100 rounded-full px-3 py-1 mr-2 mt-1"
                  >
                    <Text className="text-sm text-gray-700">{user.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-full"
          onPress={onAddTransaction}
        >
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
