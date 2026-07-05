import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('@creit.tech/stellar-wallets-kit', () => {
  return {
    StellarWalletsKit: vi.fn(),
    WalletNetwork: { TESTNET: 'TESTNET' },
    allowAllModules: vi.fn(),
    FREIGHTER_ID: 'freighter',
  };
});

vi.mock('@stellar/freighter-api', () => {
  return {
    getAddress: vi.fn(),
    signTransaction: vi.fn(),
  };
});
