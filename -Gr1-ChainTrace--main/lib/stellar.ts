import * as StellarSdk from '@stellar/stellar-sdk';
import {
  FREIGHTER_ID,
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit';
import {
  STELLAR_RPC_URL,
  HORIZON_URL,
  NETWORK_PASSPHRASE,
  EXPLORER_BASE_URL,
} from './constants';

export class StellarHelper {
  private server: StellarSdk.Horizon.Server;
  private rpcServer: StellarSdk.SorobanRpc.Server;
  private kit: StellarWalletsKit | null = null;

  constructor() {
    this.server = new StellarSdk.Horizon.Server(HORIZON_URL);
    this.rpcServer = new StellarSdk.SorobanRpc.Server(STELLAR_RPC_URL);
  }

  /* ─── Wallet ─── */

  getKit(): StellarWalletsKit {
    if (typeof window === 'undefined') {
      throw new Error('Wallet actions are only available in the browser.');
    }
    if (!this.kit) {
      this.kit = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWalletId: FREIGHTER_ID,
        modules: allowAllModules(),
      });
    }
    return this.kit;
  }

  async connectWallet(walletId?: string): Promise<string> {
    try {
      const kit = this.getKit();
      if (walletId) kit.setWallet(walletId);

      await kit.openModal({
        onWalletSelected: async (option) => kit.setWallet(option.id),
      });

      const { address } = await kit.getAddress();
      if (!address) throw new Error('No wallet address returned.');
      return address;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.toLowerCase().includes('rejected') || message.toLowerCase().includes('denied')) {
        throw new Error('Wallet connection was declined by the user.');
      }
      if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('install')) {
        throw new Error('Please install Freighter or another Stellar wallet extension.');
      }
      throw new Error(`Wallet connection failed: ${message}`);
    }
  }

  disconnect() {
    this.kit = null;
  }

  /* ─── Balance ─── */

  async getBalance(publicKey: string): Promise<{ xlm: string }> {
    try {
      const account = await this.server.loadAccount(publicKey);
      const xlm = account.balances.find((b) => b.asset_type === 'native');
      return { xlm: xlm && 'balance' in xlm ? xlm.balance : '0' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('404') || message.includes('Not Found')) {
        throw new Error('Account not found. Please fund it with test XLM from Friendbot.');
      }
      throw new Error(`Balance fetch failed: ${message}`);
    }
  }

  /* ─── Direct Payments ─── */

  async sendXlmTransaction(sender: string, recipient: string, amount: string): Promise<{ hash: string }> {
    try {
      const sourceAccount = await this.server.loadAccount(sender);
      const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: recipient,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(30)
        .build();

      const { signedTxXdr } = await this.getKit().signTransaction(tx.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      const signed = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
      const submitResult = await this.server.submitTransaction(signed);
      return { hash: submitResult.hash };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.toLowerCase().includes('rejected') || message.toLowerCase().includes('declined')) {
        throw new Error('Transaction rejected by the user.');
      }
      if (message.includes('underfunded') || message.toLowerCase().includes('insufficient')) {
        throw new Error('Insufficient XLM balance for transaction or fees.');
      }
      throw new Error(`Transaction failed: ${message}`);
    }
  }

  /* ─── Contract Call Handlers ─── */

  async buildAndSignTx(params: {
    publicKey: string;
    contractId: string;
    method: string;
    args?: StellarSdk.xdr.ScVal[];
  }): Promise<{ hash: string }> {
    const sourceAccount = await this.server.loadAccount(params.publicKey);
    const contract = new StellarSdk.Contract(params.contractId);
    const args = params.args || [];

    const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call(params.method, ...args))
      .setTimeout(30)
      .build();

    const simulation = await this.rpcServer.simulateTransaction(tx);

    if (StellarSdk.SorobanRpc.Api.isSimulationError(simulation)) {
      const errMsg = simulation.error || 'Simulation failed';
      if (errMsg.toLowerCase().includes('balance') || errMsg.toLowerCase().includes('insufficient')) {
        throw new Error('Insufficient XLM balance for transaction fees.');
      }
      throw new Error(`Contract simulation failed: ${errMsg}`);
    }

    const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(tx, simulation).build();

    const { signedTxXdr } = await this.getKit().signTransaction(preparedTx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const signed = StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
    const sendResponse = await this.rpcServer.sendTransaction(signed);

    if (sendResponse.status === 'ERROR') {
      throw new Error('Transaction submission failed.');
    }

    return { hash: sendResponse.hash };
  }

  async simulateRead(params: {
    publicKey: string;
    contractId: string;
    method: string;
    args?: StellarSdk.xdr.ScVal[];
  }): Promise<StellarSdk.xdr.ScVal | null> {
    const sourceAccount = await this.server.loadAccount(params.publicKey);
    const contract = new StellarSdk.Contract(params.contractId);
    const args = params.args || [];

    const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call(params.method, ...args))
      .setTimeout(30)
      .build();

    const simulation = await this.rpcServer.simulateTransaction(tx);

    if (StellarSdk.SorobanRpc.Api.isSimulationError(simulation)) {
      throw new Error(`Read failed: ${simulation.error}`);
    }

    return simulation.result?.retval || null;
  }

  /* ─── Transaction Polling ─── */

  async pollTransaction(hash: string): Promise<{ status: 'PENDING' | 'SUCCESS' | 'FAILED'; returnValue?: string }> {
    try {
      const response = await this.rpcServer.getTransaction(hash);

      if (response.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
        return { status: 'PENDING' };
      }
      if (response.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.FAILED) {
        return { status: 'FAILED' };
      }
      return {
        status: 'SUCCESS',
        returnValue: response.returnValue
          ? String(StellarSdk.scValToNative(response.returnValue))
          : undefined,
      };
    } catch {
      return { status: 'PENDING' };
    }
  }

  /* ─── Contract Events ─── */

  async getContractEvents(contractId: string, limit: number = 10): Promise<any[]> {
    try {
      const latestLedger = await this.rpcServer.getLatestLedger();
      const response = await this.rpcServer.getEvents({
        startLedger: Math.max(0, latestLedger.sequence - 30),
        filters: [{ type: 'contract', contractIds: [contractId] }],
        limit,
      });

      return response.events.map((event) => ({
        id: event.id,
        type: event.type,
        topic: event.topic.map((t) => String(StellarSdk.scValToNative(t))),
        value: StellarSdk.scValToNative(event.value),
        ledger: event.ledger,
        txHash: event.txHash,
        createdAt: event.ledgerClosedAt,
      }));
    } catch {
      return [];
    }
  }

  /* ─── Utilities ─── */

  formatAddress(address: string, start: number = 4, end: number = 4): string {
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  }

  getExplorerLink(hash: string, type: 'tx' | 'account' | 'contract' = 'tx'): string {
    return `${EXPLORER_BASE_URL}/${type}/${hash}`;
  }

  stroopsToXlm(stroops: string | number | bigint): string {
    const value = BigInt(stroops);
    const whole = value / BigInt(10_000_000);
    const fraction = value % BigInt(10_000_000);
    return `${whole}.${String(fraction).padStart(7, '0')}`;
  }

  xlmToStroops(xlm: string): string {
    const parts = xlm.split('.');
    const whole = BigInt(parts[0] || '0') * BigInt(10_000_000);
    const frac = parts[1] ? BigInt(parts[1].padEnd(7, '0').slice(0, 7)) : BigInt(0);
    return String(whole + frac);
  }
}

export const stellar = new StellarHelper();
