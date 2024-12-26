// Supported private key formats and their validation
export const KEY_FORMATS = {
  HEX: {
    validate: (key) => /^[0-9a-fA-F]{128}$/.test(key),
    message: 'Private key must be a 64-byte (128 character) hex string'
  },
  BASE58: {
    validate: (key) => /^[1-9A-HJ-NP-Za-km-z]{88}$/.test(key),
    message: 'Private key must be a valid 88-character base58 string'
  }
};