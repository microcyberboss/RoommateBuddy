import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { addTransaction } from '../src/api/api';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Header } from '../src/components/Header';
import { LoadingIndicator } from '../src/components/LoadingIndicator';
import { OfflineNotification } from '../src/components/OfflineNotification';
import { useOffline } from '../src/context/OfflineContext';

export default function AddTransactionScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'dr' | 'cr'>('dr');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { isOnline, addOfflineTransaction } = useOffline();

  useEffect(() => {
    if (!roomId) {
      Alert.alert('Error', 'Room ID is required');
      router.back();
    }
  }, [roomId]);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!description || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const roomIdNumber = parseInt(roomId as string);
    if (isNaN(roomIdNumber)) {
      Alert.alert('Error', 'Invalid room ID');
      return;
    }

    // Create transaction payload
    const transactionPayload = {
      room_id: roomIdNumber,
      description,
      amount: parseFloat(amount),
      type,
      date: format(date, 'yyyy-MM-dd')
    };

    setIsSubmitting(true);

    try {
      // If online, add transaction directly to API
      if (isOnline) {
        await addTransaction(transactionPayload);
        Alert.alert('Success', 'Transaction added successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } 
      // If offline, store transaction locally
      else {
        await addOfflineTransaction(transactionPayload);
        Alert.alert('Success', 'Transaction saved offline. It will sync when you reconnect.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      // If we're online but the API call failed, try to save offline
      if (isOnline) {
        try {
          await addOfflineTransaction(transactionPayload);
          Alert.alert('Info', 'Could not connect to server. Transaction saved offline and will sync later.', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        } catch (offlineError) {
          Alert.alert('Error', 'Failed to add transaction: ' + error.message);
        }
      } else {
        Alert.alert('Error', error.message || 'Failed to add transaction');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header title="Add Transaction" showBackButton />
      <OfflineNotification />
      <ScrollView className="flex-1 p-6" keyboardShouldPersistTaps="handled">
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter transaction description"
        />

        <Input
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount"
        />

        <View className="mt-4 mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Transaction Type</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 p-3 rounded-l-md flex-row justify-center items-center ${
                type === 'dr' ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onPress={() => setType('dr')}
            >
              <Feather name="arrow-up-right" size={18} color={type === 'dr' ? 'white' : 'black'} />
              <Text
                className={`ml-2 ${
                  type === 'dr' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Debit (I paid)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-3 rounded-r-md flex-row justify-center items-center ${
                type === 'cr' ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onPress={() => setType('cr')}
            >
              <Feather name="arrow-down-left" size={18} color={type === 'cr' ? 'white' : 'black'} />
              <Text
                className={`ml-2 ${
                  type === 'cr' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Credit (I owe)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4 mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Date</Text>
          <TouchableOpacity
            className="p-3 bg-white border border-gray-300 rounded-md flex-row justify-between items-center"
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{format(date, 'MMMM dd, yyyy')}</Text>
            <Feather name="calendar" size={18} color="#6b7280" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        <Button
          title="Add Transaction"
          onPress={handleSubmit}
          className="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
