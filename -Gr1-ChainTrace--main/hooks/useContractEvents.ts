'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { stellar } from '@/lib/stellar';
import type { ContractEvent } from '@/lib/types';

export function useContractEvents(contractId: string | undefined, intervalMs: number = 10_000) {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!contractId) return;
    try {
      const data = await stellar.getContractEvents(contractId, 12);
      setEvents(data);
    } catch {
      /* silently ignore event fetch errors */
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchEvents();
    timerRef.current = setInterval(fetchEvents, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchEvents, intervalMs]);

  return { events, loading, refetch: fetchEvents };
}
