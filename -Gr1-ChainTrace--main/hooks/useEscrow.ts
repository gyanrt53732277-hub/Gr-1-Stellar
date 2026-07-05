'use client';

import { useCallback, useEffect, useState } from 'react';
import { escrowClient } from '@/lib/contracts/escrow-client';
import type { EscrowDeposit } from '@/lib/types';

export function useEscrow(orderId: number, publicKey?: string) {
  const [escrow, setEscrow] = useState<EscrowDeposit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEscrow = useCallback(async () => {
    if (!publicKey || !orderId) {
      setEscrow(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await escrowClient.getEscrow(orderId, publicKey);
      setEscrow(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load escrow';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [orderId, publicKey]);

  useEffect(() => {
    fetchEscrow();
  }, [fetchEscrow]);

  return { escrow, loading, error, refetch: fetchEscrow };
}
