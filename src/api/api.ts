import axios from 'axios';
import { getToken } from '../utils/storage';
import {
  User,
  Room,
  Transaction,
  TransactionPayload,
  AuthResponse,
  VerifyEmailResponse,
  DebtsResponse,
  RoomResponse,
  TransactionResponse,
  PasswordResetResponse
} from './types';

const API_URL = 'https://api.fintrack.com';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API Functions
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/login', {
    email,
    password
  });
  return response.data;
};

export const signup = async (
  name: string,
  email: string,
  phone: string | null,
  password: string,
  type: 'admin' | 'user' = 'user'
): Promise<{ message: string; token: string }> => {
  const response = await api.post<{ message: string; token: string }>('/api/signup', {
    name,
    email,
    phone,
    password,
    type
  });
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/api/logout');
  return response.data;
};

export const requestPasswordReset = async (email: string): Promise<PasswordResetResponse> => {
  const response = await api.post<PasswordResetResponse>('/api/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (
  email: string,
  token: string,
  password: string,
  password_confirmation: string
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/api/reset-password', {
    email,
    token,
    password,
    password_confirmation
  });
  return response.data;
};

export const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  const response = await api.get<VerifyEmailResponse>(`/api/verify-email?token=${token}`);
  return response.data;
};

// Rooms API Functions
export const getRooms = async (): Promise<RoomResponse> => {
  const response = await api.get<RoomResponse>('/api/rooms');
  return response.data;
};

export const createRoom = async (name: string): Promise<{ message: string; room: Room }> => {
  const response = await api.post<{ message: string; room: Room }>('/api/rooms', { name });
  return response.data;
};

export const joinRoom = async (roomId: number): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/api/rooms/${roomId}/join`);
  return response.data;
};

// Transactions API Functions
export const addTransaction = async (transaction: TransactionPayload): Promise<{ message: string; transaction: Transaction }> => {
  const response = await api.post<{ message: string; transaction: Transaction }>('/api/transactions', transaction);
  return response.data;
};

export const getTransactions = async (period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<TransactionResponse> => {
  const response = await api.get<TransactionResponse>(`/api/transactions?period=${period}`);
  return response.data;
};

export const getRoomTransactions = async (roomId: number): Promise<TransactionResponse> => {
  const response = await api.get<TransactionResponse>(`/api/rooms/${roomId}/transactions`);
  return response.data;
};

export const settleTransactions = async (transactionIds: number[]): Promise<{ message: string; settled_count: number }> => {
  const response = await api.post<{ message: string; settled_count: number }>('/api/transactions/settle', {
    transaction_ids: transactionIds
  });
  return response.data;
};

// Debts API Functions
export const getDebts = async (period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<DebtsResponse> => {
  const response = await api.get<DebtsResponse>(`/api/debts?period=${period}`);
  return response.data;
};
