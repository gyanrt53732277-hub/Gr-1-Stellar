'use client';

export interface TelemetryEvent {
  id: string;
  type: 'wallet_connect' | 'wallet_disconnect' | 'transaction' | 'error' | 'page_view';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'chaintrace_telemetry';

export const telemetry = {
  getEvents(): TelemetryEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.initializeMockData();
    } catch {
      return [];
    }
  },

  log(
    type: TelemetryEvent['type'],
    message: string,
    metadata?: Record<string, any>
  ) {
    if (typeof window === 'undefined') return;
    try {
      const events = this.getEvents();
      const newEvent: TelemetryEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        timestamp: new Date().toISOString(),
        metadata,
      };
      events.unshift(newEvent);
      // Keep max 100 events
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, 100)));
    } catch (e) {
      console.error('Failed to log telemetry', e);
    }
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  initializeMockData(): TelemetryEvent[] {
    // Generate some mock history events so the analytics page isn't blank on first load
    const mockEvents: TelemetryEvent[] = [
      {
        id: 'mock1',
        type: 'wallet_connect',
        message: 'Wallet connected successfully: GD4X...92LK',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        metadata: { walletType: 'freighter' },
      },
      {
        id: 'mock2',
        type: 'transaction',
        message: 'Escrow funded for Order #28',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        metadata: { orderId: 28, amount: '500 XLM', txHash: '8b3c...9f2d' },
      },
      {
        id: 'mock3',
        type: 'page_view',
        message: 'Visited Dashboard page',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'mock4',
        type: 'transaction',
        message: 'Order #27 completed, payout released',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        metadata: { orderId: 27, status: 'completed' },
      },
      {
        id: 'mock5',
        type: 'error',
        message: 'Failed to fetch balance: Network timeout',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        metadata: { errorCode: 'RPC_TIMEOUT' },
      },
      {
        id: 'mock6',
        type: 'wallet_connect',
        message: 'Wallet connected: GA7N...51OP',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        metadata: { walletType: 'xbull' },
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvents));
    return mockEvents;
  },
};
