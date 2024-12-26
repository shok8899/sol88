import pkg from '@solana/web3.js';
const { Keypair } = pkg;

import { KEY_FORMATS } from './key-formats.js';
import { parseHexKey, parseBase58Key } from './key-parser.js';
import { logger } from './logger.js';

export const validateAndParsePrivateKey = (privateKeyString) => {
  if (!privateKeyString) {
    throw new Error('Private key is required');
  }

  // Remove whitespace and optional '0x' prefix
  const cleanKey = privateKeyString.replace('0x', '').trim();

  try {
    // Try hex format first
    if (KEY_FORMATS.HEX.validate(cleanKey)) {
      const keyBytes = parseHexKey(cleanKey);
      return Keypair.fromSecretKey(keyBytes);
    }

    // Try base58 format
    if (KEY_FORMATS.BASE58.validate(cleanKey)) {
      const keyBytes = parseBase58Key(cleanKey);
      return Keypair.fromSecretKey(keyBytes);
    }

    // No valid format found
    throw new Error('Invalid private key format. Must be either:\n' +
      '1. 64-byte (128 character) hex string\n' +
      '2. 88-character base58 string');

  } catch (error) {
    logger.error('Failed to parse private key:', error.message);
    throw new Error(`Invalid private key: ${error.message}`);
  }
};