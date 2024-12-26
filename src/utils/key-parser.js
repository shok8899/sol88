import bs58 from 'bs58';
import { logger } from './logger.js';

export const parseHexKey = (hexString) => {
  try {
    const matches = hexString.match(/.{2}/g);
    if (!matches) {
      throw new Error('Invalid hex string format');
    }
    return new Uint8Array(
      matches.map(byte => parseInt(byte, 16))
    );
  } catch (error) {
    logger.error('Failed to parse hex key:', error.message);
    throw new Error('Invalid hex key format');
  }
};

export const parseBase58Key = (base58String) => {
  try {
    return new Uint8Array(bs58.decode(base58String));
  } catch (error) {
    logger.error('Failed to parse base58 key:', error.message);
    throw new Error('Invalid base58 key format');
  }
};