'use client';

import { useCallback, useEffect, useState } from 'react';
import { orderClient } from '@/lib/contracts/order-client';
import type { Order } from '@/lib/types';

export function useOrders(publicKey?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!publicKey) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const count = await orderClient.getOrderCount(publicKey);
      const fetched: Order[] = [];

      for (let i = 1; i <= count; i++) {
        try {
          const order = await orderClient.getOrder(i, publicKey);
          fetched.push(order);
        } catch {
          // skip orders that fail to load
        }
      }

      setOrders(fetched.reverse());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
