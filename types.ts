
export type UserStatus = 'pending' | 'active' | 'rejected';

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  type?: 'standard' | 'bonus';
  bonusName?: string;
  amount?: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  username?: string;
  password?: string;
  status: UserStatus;
  balance: number;
  accessCode?: string;
  registeredAt: number;
  notifications: Notification[];
}

export interface Transaction {
  id: string;
  reference: string; // 20-digit unique number
  reason: string;    // Reason for the transfer
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  toCode: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface AppState {
  users: User[];
  transactions: Transaction[];
  currentUser: User | null;
  isAdmin: boolean;
}
