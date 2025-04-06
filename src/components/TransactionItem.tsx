import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Transaction } from '../api/types';

interface TransactionItemProps {
  transaction: Transaction;
  isSelected: boolean;
  onSelect: () => void;
}

export const TransactionItem = ({ transaction, isSelected, onSelect }: TransactionItemProps) => {
  const isSelectable = !transaction.settled && transaction.type === 'dr';
  const formattedDate = format(parseISO(transaction.date), 'MMM dd, yyyy');
  const formattedAmount = `$${transaction.amount.toFixed(2)}`;
  
  return (
    <TouchableOpacity
      className={`flex-row items-center bg-white p-4 border-b border-gray-100 ${
        transaction.settled ? 'opacity-70' : ''
      } ${isSelected ? 'bg-blue-50' : ''}`}
      onPress={onSelect}
      disabled={!isSelectable}
    >
      <View className={`w-8 mr-4 ${isSelectable ? '' : 'opacity-50'}`}>
        {isSelectable && (
          <Feather 
            name={isSelected ? 'check-square' : 'square'} 
            size={20} 
            color={isSelected ? '#3b82f6' : '#9ca3af'} 
          />
        )}
        {!isSelectable && transaction.settled && (
          <Feather name="check-circle" size={20} color="#10b981" />
        )}
        {!isSelectable && !transaction.settled && (
          <Feather name="clock" size={20} color="#9ca3af" />
        )}
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800">
          {transaction.description}
        </Text>
        
        <View className="flex-row justify-between mt-1">
          <Text className="text-sm text-gray-500">
            {transaction.user?.name || 'User'} • {formattedDate}
          </Text>
          <Text 
            className={`font-semibold ${
              transaction.type === 'dr' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {transaction.type === 'dr' ? '+' : '-'} {formattedAmount}
          </Text>
        </View>
        
        {transaction.settled && (
          <Text className="text-xs text-green-600 mt-1">Settled</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
