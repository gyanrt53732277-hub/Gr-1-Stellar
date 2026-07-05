import { describe, it, expect } from 'vitest';
import { stellar } from '@/lib/stellar';

describe('StellarHelper Utilities', () => {
  describe('formatAddress', () => {
    it('truncates public keys correctly', () => {
      const address = 'GB7OTVADKAP2N7CLW5X7Q5ZAKN6635PEIX4UKSX5TPSPGFF3ND224EIN';
      expect(stellar.formatAddress(address)).toBe('GB7O...4EIN');
    });

    it('returns short addresses as-is', () => {
      const short = 'GABC';
      expect(stellar.formatAddress(short)).toBe('GABC');
    });
  });

  describe('getExplorerLink', () => {
    it('generates correct transaction link', () => {
      const tx = 'abc123hash';
      expect(stellar.getExplorerLink(tx, 'tx')).toBe('https://stellar.expert/explorer/testnet/tx/abc123hash');
    });

    it('generates correct account link', () => {
      const acc = 'GACC';
      expect(stellar.getExplorerLink(acc, 'account')).toBe('https://stellar.expert/explorer/testnet/account/GACC');
    });
  });

  describe('stroopsToXlm', () => {
    it('converts basic stroop balances correctly', () => {
      expect(stellar.stroopsToXlm(100_0000000)).toBe('100.0000000');
      expect(stellar.stroopsToXlm(70000000)).toBe('7.0000000');
    });
  });

  describe('xlmToStroops', () => {
    it('converts XLM amounts to stroops correctly', () => {
      expect(stellar.xlmToStroops('10')).toBe('100000000');
      expect(stellar.xlmToStroops('1.5')).toBe('15000000');
    });
  });
});
