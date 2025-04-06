import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { getRooms, createRoom, joinRoom } from '../../src/api/api';
import { RoomItem } from '../../src/components/RoomItem';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { LoadingIndicator } from '../../src/components/LoadingIndicator';
import { Room } from '../../src/api/types';

export default function RoomsScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  
  const router = useRouter();

  // Load rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const roomsData = await getRooms();
      setRooms(roomsData.rooms);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load rooms');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    setIsLoading(true);
    try {
      await createRoom(newRoomName);
      setNewRoomName('');
      setShowCreateModal(false);
      fetchRooms();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomIdToJoin.trim()) {
      Alert.alert('Error', 'Please enter a room ID');
      return;
    }

    setIsLoading(true);
    try {
      const roomId = parseInt(roomIdToJoin);
      if (isNaN(roomId)) {
        throw new Error('Invalid room ID format');
      }
      await joinRoom(roomId);
      setRoomIdToJoin('');
      setShowJoinModal(false);
      fetchRooms();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = (roomId: number) => {
    router.push({
      pathname: '/add-transaction',
      params: { roomId }
    });
  };

  if (isLoading && !refreshing) {
    return <LoadingIndicator />;
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Create Room Modal */}
      {showCreateModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-10 justify-center items-center">
          <View className="bg-white p-6 rounded-lg w-5/6 max-w-md">
            <Text className="text-xl font-bold mb-4">Create New Room</Text>
            <Input
              label="Room Name"
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholder="Enter room name"
            />
            <View className="flex-row justify-end mt-4 space-x-2">
              <TouchableOpacity 
                className="px-4 py-2 bg-gray-200 rounded-md"
                onPress={() => setShowCreateModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="px-4 py-2 bg-blue-500 rounded-md"
                onPress={handleCreateRoom}
              >
                <Text className="text-white">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 z-10 justify-center items-center">
          <View className="bg-white p-6 rounded-lg w-5/6 max-w-md">
            <Text className="text-xl font-bold mb-4">Join a Room</Text>
            <Input
              label="Room ID"
              value={roomIdToJoin}
              onChangeText={setRoomIdToJoin}
              placeholder="Enter room ID"
              keyboardType="numeric"
            />
            <View className="flex-row justify-end mt-4 space-x-2">
              <TouchableOpacity 
                className="px-4 py-2 bg-gray-200 rounded-md"
                onPress={() => setShowJoinModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="px-4 py-2 bg-blue-500 rounded-md"
                onPress={handleJoinRoom}
              >
                <Text className="text-white">Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Room List */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RoomItem 
            room={item} 
            onAddTransaction={() => handleAddTransaction(item.id)}
          />
        )}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-lg">No rooms found</Text>
            <Text className="text-gray-400 mt-1 text-center">
              Create or join a room to get started with expense tracking
            </Text>
          </View>
        }
      />

      {/* Action Buttons */}
      <View className="absolute bottom-6 right-6 flex-row space-x-2">
        <TouchableOpacity
          className="w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-lg"
          onPress={() => setShowJoinModal(true)}
        >
          <Feather name="log-in" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
          onPress={() => setShowCreateModal(true)}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
