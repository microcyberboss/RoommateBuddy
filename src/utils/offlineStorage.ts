import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionPayload } from '../api/types';
import { getToken, getUser } from './storage';
import NetInfo from '@react-native-community/netinfo';

const OFFLINE_TRANSACTIONS_KEY = 'offline_transactions';

// Store a transaction to be synced later
export const storeOfflineTransaction = async (transaction: TransactionPayload): Promise<void> => {
  try {
    // First get existing offline transactions
    const existingTransactions = await getOfflineTransactions();
    
    // Add new transaction to the list
    const updatedTransactions = [...existingTransactions, transaction];
    
    // Store the updated list
    await AsyncStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  } catch (error) {
    console.error('Error storing offline transaction:', error);
  }
};

// Get all stored offline transactions
export const getOfflineTransactions = async (): Promise<TransactionPayload[]> => {
  try {
    const transactions = await AsyncStorage.getItem(OFFLINE_TRANSACTIONS_KEY);
    return transactions ? JSON.parse(transactions) : [];
  } catch (error) {
    console.error('Error retrieving offline transactions:', error);
    return [];
  }
};

// Remove a specific transaction from offline storage
export const removeOfflineTransaction = async (transactionToRemove: TransactionPayload): Promise<void> => {
  try {
    const transactions = await getOfflineTransactions();
    
    // Filter out the transaction to remove
    // Note: This is a simple implementation and might need a more robust comparison
    const updatedTransactions = transactions.filter(
      transaction => 
        !(transaction.room_id === transactionToRemove.room_id && 
          transaction.description === transactionToRemove.description &&
          transaction.amount === transactionToRemove.amount &&
          transaction.date === transactionToRemove.date)
    );
    
    await AsyncStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  } catch (error) {
    console.error('Error removing offline transaction:', error);
  }
};

// Clear all offline transactions
export const clearOfflineTransactions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(OFFLINE_TRANSACTIONS_KEY);
  } catch (error) {
    console.error('Error clearing offline transactions:', error);
  }
};

// Check if the device is connected to the internet
export const isConnected = async (): Promise<boolean> => {
  try {
    const connectionInfo = await NetInfo.fetch();
    return connectionInfo.isConnected || false;
  } catch (error) {
    console.error('Error checking internet connection:', error);
    return false;
  }
};

// Get the count of offline transactions
export const getOfflineTransactionCount = async (): Promise<number> => {
  try {
    const transactions = await getOfflineTransactions();
    return transactions.length;
  } catch (error) {
    console.error('Error getting offline transaction count:', error);
    return 0;
  }
};