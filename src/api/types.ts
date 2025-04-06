// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  profile_pic: string | null;
  type: 'admin' | 'user';
}

// Auth types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface PasswordResetResponse {
  message: string;
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  token: string;
  user: User;
}

// Room types
export interface Room {
  id: number;
  name: string;
  created_by: number;
  users?: User[];
}

export interface RoomResponse {
  rooms: Room[];
}

// Transaction types
export interface Transaction {
  id: number;
  room_id: number;
  user_id: number;
  description: string;
  amount: number;
  type: 'dr' | 'cr';
  date: string;
  settled: boolean;
  user?: User;
}

export interface TransactionPayload {
  room_id: number;
  description: string;
  amount: number;
  type: 'dr' | 'cr';
  date: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
}

// Debt types
export interface DebtToUser {
  to_user: {
    id: number;
    name: string;
  };
  amount: number;
  transaction_id: number;
  settled: boolean;
}

export interface DebtFromUser {
  from_user: {
    id: number;
    name: string;
  };
  amount: number;
  transaction_id: number;
  settled: boolean;
}

export type Debt = DebtToUser | DebtFromUser;

export interface DebtsResponse {
  debts_owed: DebtToUser[];
  debts_owing: DebtFromUser[];
}
