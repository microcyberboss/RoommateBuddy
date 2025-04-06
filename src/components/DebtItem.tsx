import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Debt } from '../api/types';

interface DebtItemProps {
  debt: Debt;
  isOwing: boolean;
}

export const DebtItem = ({ debt, isOwing }: DebtItemProps) => {
  // Determine if we're dealing with an owing or owed debt
  const personName = isOwing 
    ? 'to_user' in debt ? debt.to_user.name : 'Unknown'
    : 'from_user' in debt ? debt.from_user.name : 'Unknown';
  
  const formattedAmount = `$${debt.amount.toFixed(2)}`;

  return (
    <View className={`bg-white p-4 border-b border-gray-100 ${
      debt.settled ? 'opacity-70' : ''
    }`}>
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          isOwing ? 'bg-red-100' : 'bg-green-100'
        }`}>
          <Feather 
            name={isOwing ? 'arrow-up-right' : 'arrow-down-left'} 
            size={18} 
            color={isOwing ? '#ef4444' : '#10b981'} 
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800">
            {isOwing ? `You owe ${personName}` : `${personName} owes you`}
          </Text>
          
          <View className="flex-row items-center mt-1">
            <Text className={`text-lg font-semibold ${
              isOwing ? 'text-red-600' : 'text-green-600'
            }`}>
              {formattedAmount}
            </Text>
            
            {debt.settled && (
              <View className="flex-row items-center ml-2 bg-green-100 rounded-full px-2 py-0.5">
                <Feather name="check" size={12} color="#10b981" />
                <Text className="text-xs text-green-700 ml-1">Settled</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
