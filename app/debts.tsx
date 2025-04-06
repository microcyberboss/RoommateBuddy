import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDebts } from '../src/api/api';
import { Debt } from '../src/api/types';
import { DebtItem } from '../src/components/DebtItem';
import { Header } from '../src/components/Header';
import { PeriodSelector } from '../src/components/PeriodSelector';
import { LoadingIndicator } from '../src/components/LoadingIndicator';

type Period = 'daily' | 'weekly' | 'monthly';

type SectionData = {
  title: string;
  data: Debt[];
};

export default function DebtsScreen() {
  const [debtsOwed, setDebtsOwed] = useState<Debt[]>([]);
  const [debtsOwing, setDebtsOwing] = useState<Debt[]>([]);
  const [period, setPeriod] = useState<Period>('weekly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDebts();
  }, [period]);

  const fetchDebts = async () => {
    setIsLoading(true);
    try {
      const response = await getDebts(period);
      setDebtsOwed(response.debts_owed);
      setDebtsOwing(response.debts_owing);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load debts');
    } finally {
      setIsLoading(false);
    }
  };

  const sections: SectionData[] = [
    {
      title: 'Debts You Owe',
      data: debtsOwing,
    },
    {
      title: 'Debts Owed to You',
      data: debtsOwed,
    },
  ];

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header title="Debts" showBackButton />
      
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <PeriodSelector
          selectedPeriod={period}
          onSelectPeriod={(newPeriod) => setPeriod(newPeriod as Period)}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.transaction_id}-${index}`}
        renderItem={({ item, section }) => (
          <DebtItem 
            debt={item} 
            isOwing={section.title === 'Debts You Owe'} 
          />
        )}
        renderSectionHeader={({ section: { title, data } }) => (
          <View className="px-4 py-2 bg-gray-200">
            <Text className="font-bold text-gray-800">{title} ({data.length})</Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-10">
            <Text className="text-gray-500 text-lg">No debts found</Text>
            <Text className="text-gray-400 mt-1 text-center">
              Debts for this period will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
