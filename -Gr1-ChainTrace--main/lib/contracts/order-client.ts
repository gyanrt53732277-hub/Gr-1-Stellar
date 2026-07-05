import * as StellarSdk from '@stellar/stellar-sdk';
import { stellar } from '../stellar';
import { ORDER_CONTRACT_ID } from '../constants';
import type { Order, OrderStatus } from '../types';

function parseOrderStatus(val: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    Created: 'created',
    Funded: 'funded',
    Shipped: 'shipped',
    Delivered: 'delivered',
    InspectedPassed: 'inspected_passed',
    InspectedFailed: 'inspected_failed',
    Refunded: 'refunded',
  };
  return map[val] || 'created';
}

function parseOrder(raw: Record<string, unknown>): Order {
  return {
    id: Number(raw.id || 0),
    buyer: String(raw.buyer || ''),
    supplier: String(raw.supplier || ''),
    shipper: String(raw.shipper || ''),
    inspector: String(raw.inspector || ''),
    amount: stellar.stroopsToXlm(String(raw.amount || '0')),
    status: parseOrderStatus(String(raw.status || 'Created')),
    createdAt: Number(raw.created_at || 0),
  };
}

export class OrderContractClient {
  private contractId: string;

  constructor(contractId: string = ORDER_CONTRACT_ID) {
    this.contractId = contractId;
  }

  async getOrderCount(publicKey: string): Promise<number> {
    try {
      const result = await stellar.simulateRead({
        publicKey,
        contractId: this.contractId,
        method: 'get_order_count',
      });
      return result ? Number(StellarSdk.scValToNative(result)) : 0;
    } catch {
      return 0;
    }
  }

  async getOrder(orderId: number, publicKey: string): Promise<Order> {
    const result = await stellar.simulateRead({
      publicKey,
      contractId: this.contractId,
      method: 'get_order',
      args: [StellarSdk.nativeToScVal(orderId, { type: 'u64' })],
    });
    if (!result) throw new Error('Order not found');
    return parseOrder(StellarSdk.scValToNative(result) as Record<string, unknown>);
  }

  async createOrder(params: {
    publicKey: string;
    supplier: string;
    shipper: string;
    inspector: string;
    amountXlm: string;
  }): Promise<{ hash: string }> {
    return stellar.buildAndSignTx({
      publicKey: params.publicKey,
      contractId: this.contractId,
      method: 'create_order',
      args: [
        StellarSdk.nativeToScVal(params.publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(params.supplier, { type: 'address' }),
        StellarSdk.nativeToScVal(params.shipper, { type: 'address' }),
        StellarSdk.nativeToScVal(params.inspector, { type: 'address' }),
        StellarSdk.nativeToScVal(BigInt(stellar.xlmToStroops(params.amountXlm)), { type: 'i128' }),
      ],
    });
  }

  async shipOrder(publicKey: string, orderId: number): Promise<{ hash: string }> {
    return stellar.buildAndSignTx({
      publicKey,
      contractId: this.contractId,
      method: 'ship_order',
      args: [
        StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(orderId, { type: 'u64' }),
      ],
    });
  }

  async deliverOrder(publicKey: string, orderId: number): Promise<{ hash: string }> {
    return stellar.buildAndSignTx({
      publicKey,
      contractId: this.contractId,
      method: 'deliver_order',
      args: [
        StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(orderId, { type: 'u64' }),
      ],
    });
  }

  async inspectOrder(publicKey: string, orderId: number, passed: boolean): Promise<{ hash: string }> {
    return stellar.buildAndSignTx({
      publicKey,
      contractId: this.contractId,
      method: 'inspect_order',
      args: [
        StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(orderId, { type: 'u64' }),
        StellarSdk.nativeToScVal(passed, { type: 'bool' }),
      ],
    });
  }

  async refundOrder(publicKey: string, orderId: number): Promise<{ hash: string }> {
    return stellar.buildAndSignTx({
      publicKey,
      contractId: this.contractId,
      method: 'refund_order',
      args: [
        StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
        StellarSdk.nativeToScVal(orderId, { type: 'u64' }),
      ],
    });
  }
}

export const orderClient = new OrderContractClient();
