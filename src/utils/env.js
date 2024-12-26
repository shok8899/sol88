import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: `${dirname(dirname(__dirname))}/.env` });

export const getEnvConfig = () => ({
  rpcEndpoint: process.env.RPC_ENDPOINT,
  privateKey: process.env.PRIVATE_KEY,
  monitoredWallets: process.env.MONITORED_WALLETS?.split(',') || [],
  tradeAmount: parseFloat(process.env.TRADE_AMOUNT || '1.0'),
  slippageMode: process.env.SLIPPAGE_MODE || 'auto',
  customSlippage: process.env.CUSTOM_SLIPPAGE ? parseFloat(process.env.CUSTOM_SLIPPAGE) : undefined,
  gasMultiplier: parseFloat(process.env.GAS_MULTIPLIER || '1.5')
});