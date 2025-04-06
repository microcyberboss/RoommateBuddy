import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { 
  getOfflineTransactions, 
  storeOfflineTransaction, 
  removeOfflineTransaction, 
  clearOfflineTransactions,
  getOfflineTransactionCount,
  isConnected as checkIsConnected
} from '../utils/offlineStorage';
import { TransactionPayload } from '../api/types';
import { addTransaction } from '../api/api';
import { useAuth } from './AuthContext';

interface OfflineContextType {
  isOnline: boolean;
  offlineTransactionCount: number;
  addOfflineTransaction: (transaction: TransactionPayload) => Promise<void>;
  syncOfflineTransactions: () => Promise<void>;
  hasPendingTransactions: boolean;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineTransactionCount, setOfflineTransactionCount] = useState<number>(0);
  const [hasPendingTransactions, setHasPendingTransactions] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    // Check initial connection state
    checkIsConnected().then(connected => {
      setIsOnline(connected);
    });

    // Check for offline transactions
    updateOfflineTransactionCount();

    return () => {
      unsubscribe();
    };
  }, []);

  // Update offline transaction count
  const updateOfflineTransactionCount = async () => {
    const count = await getOfflineTransactionCount();
    setOfflineTransactionCount(count);
    setHasPendingTransactions(count > 0);
  };

  // Add a transaction to offline storage
  const addOfflineTransaction = async (transaction: TransactionPayload) => {
    if (!isAuthenticated) return; // Only store transactions if user is authenticated
    
    await storeOfflineTransaction(transaction);
    await updateOfflineTransactionCount();
  };

  // Sync offline transactions with server when online
  const syncOfflineTransactions = async () => {
    if (!isOnline || !isAuthenticated) return;

    const offlineTransactions = await getOfflineTransactions();
    
    // No transactions to sync
    if (offlineTransactions.length === 0) return;

    // Try to sync each transaction
    for (const transaction of offlineTransactions) {
      try {
        // Send transaction to server
        await addTransaction(transaction);
        
        // Remove from offline storage after successful sync
        await removeOfflineTransaction(transaction);
      } catch (error) {
        console.error('Error syncing transaction:', error);
        // If there's an error, we'll leave the transaction in offline storage
        // to try again later
      }
    }

    // Update count after sync attempt
    await updateOfflineTransactionCount();
  };

  // Try to sync transactions when app comes online
  useEffect(() => {
    if (isOnline && offlineTransactionCount > 0) {
      syncOfflineTransactions();
    }
  }, [isOnline]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        offlineTransactionCount,
        addOfflineTransaction,
        syncOfflineTransactions,
        hasPendingTransactions
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};