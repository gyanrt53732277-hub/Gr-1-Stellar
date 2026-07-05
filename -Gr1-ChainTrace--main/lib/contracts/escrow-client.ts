import * as StellarSdk from '@stellar/stellar-sdk';
import { stellar } from '../stellar';
import { ESCROW_CONTRACT_ID } from '../constants';
import type { EscrowDeposit } from '../types';

export class EscrowContractClient {
  private contractId: string;

  constructor(contractId: string = ESCROW_CONTRACT_ID) {
    this.contractId = contractId;
  }

  async getEscrow(orderId: number, publicKey: string): Promise<EscrowDeposit | null> {
    try {
      const result = await stellar.simulateRead({
        publicKey,
        contractId: this.contractId,
        method: 'get_escrow',
        args: [StellarSdk.nativeToScVal(orderId, { type: 'u64' })],
      });
      if (!result) return null;

      const raw = StellarSdk.scValToNative(result) as Record<string, unknown>;
      return {
        orderId: Number(raw.order_id || 0),
        buyer: String(raw.buyer || ''),
        amount: stellar.stroopsToXlm(String(raw.amount || '0')),
        isActive: Boolean(raw.is_active),
      };
    } catch {
      return null;
    }
  }

  async getTotalEscrowed(publicKey: string): Promise<string> {
    try {
      const result = await stellar.simulateRead({
        publicKey,
        contractId: this.contractId,
        method: 'get_total_escrowed',
      });
      return result ? stellar.stroopsToXlm(String(StellarSdk.scValToNative(result))) : '0';
    } catch {
      return '0';
    }
  }

  async deposit(publicKey: string, orderId: number, amountXlm: string): Promise<{ hash: string }> {
    return stellar.buildAndSignTx({
      publicKey,
      contractId: this.contractId,
      method: 'deposit',
      args: [
        StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(orderId, { type: 'u64' }),
        StellarSdk.nativeToScVal(BigInt(stellar.xlmToStroops(amountXlm)), { type: 'i128' }),
      ],
    });
  }
}

export const escrowClient = new EscrowContractClient();
