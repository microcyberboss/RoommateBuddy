import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getTransactions, settleTransactions } from '../src/api/api';
import { Transaction } from '../src/api/types';
import { TransactionItem } from '../src/components/TransactionItem';
import { Header } from '../src/components/Header';
import { Button } from '../src/components/Button';
import { PeriodSelector } from '../src/components/PeriodSelector';
import { LoadingIndicator } from '../src/components/LoadingIndicator';

type Period = 'daily' | 'weekly' | 'monthly';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());
  const [period, setPeriod] = useState<Period>('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTransactions();
  }, [period]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await getTransactions(period);
      setTransactions(response.transactions);
      // Clear selected transactions when changing period
      setSelectedTransactions(new Set());
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTransactionSelection = (id: number, canBeSelected: boolean) => {
    if (!canBeSelected) return;
    
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSettleSelected = async () => {
    if (selectedTransactions.size === 0) {
      Alert.alert('Info', 'No transactions selected');
      return;
    }

    setIsSubmitting(true);
    try {
      await settleTransactions(Array.from(selectedTransactions));
      Alert.alert('Success', 'Transactions settled successfully');
      // Refresh transaction list
      fetchTransactions();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to settle transactions');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header title="Transactions" showBackButton />
      
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <PeriodSelector
          selectedPeriod={period}
          onSelectPeriod={(newPeriod) => setPeriod(newPeriod as Period)}
        />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            isSelected={selectedTransactions.has(item.id)}
            onSelect={() => toggleTransactionSelection(
              item.id,
              !item.settled && item.type === 'dr' // Only allow selection if not settled and user paid
            )}
          />
        )}
        contentContainerClassName="px-4 py-2"
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-lg">No transactions found</Text>
            <Text className="text-gray-400 mt-1 text-center">
              Transactions for this period will appear here
            </Text>
          </View>
        }
      />
      
      {selectedTransactions.size > 0 && (
        <View className="p-4 bg-white border-t border-gray-200">
          <Button
            title={`Settle Selected (${selectedTransactions.size})`}
            onPress={handleSettleSelected}
            disabled={isSubmitting}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
