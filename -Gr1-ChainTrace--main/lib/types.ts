export type WalletType = 'freighter' | 'xbull' | 'albedo';

export interface WalletState {
  publicKey: string | null;
  walletType: WalletType | null;
  balance: string;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

export interface TransactionStatus {
  status: 'idle' | 'pending' | 'success' | 'failure';
  txHash: string | null;
  error: string | null;
}

export type OrderStatus =
  | 'created'
  | 'funded'
  | 'shipped'
  | 'delivered'
  | 'inspected_passed'
  | 'inspected_failed'
  | 'refunded';

export interface Order {
  id: number;
  buyer: string;
  supplier: string;
  shipper: string;
  inspector: string;
  amount: string;
  status: OrderStatus;
  createdAt: number;
}

export interface EscrowDeposit {
  orderId: number;
  buyer: string;
  amount: string;
  isActive: boolean;
}

export interface ContractEvent {
  id: string;
  type: string;
  topic: string[];
  value: unknown;
  ledger: number;
  txHash: string;
  createdAt: string;
}

