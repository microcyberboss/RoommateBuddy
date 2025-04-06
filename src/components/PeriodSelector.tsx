import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}

export const PeriodSelector = ({ selectedPeriod, onSelectPeriod }: PeriodSelectorProps) => {
  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  return (
    <View>
      <Text className="text-gray-700 mb-2 text-sm">Period</Text>
      <View className="flex-row bg-gray-100 rounded-lg p-1">
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            className={`flex-1 py-2 px-3 rounded-md ${
              selectedPeriod === period.id ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => onSelectPeriod(period.id)}
          >
            <Text 
              className={`text-center text-sm ${
                selectedPeriod === period.id 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-500'
              }`}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
