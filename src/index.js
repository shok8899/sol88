import { createConnection } from './utils/connection.js';
import { getEnvConfig } from './utils/env.js';
import { validateAndParsePrivateKey } from './utils/key-management.js';
import { config } from './config.js';
import { WalletMonitor } from './services/wallet-monitor.js';
import { TradeExecutor } from './services/trade-executor.js';
import { ProfitTracker } from './services/profit-tracker.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    const connection = createConnection();
    const envConfig = getEnvConfig();
    
    const privateKey = validateAndParsePrivateKey(envConfig.privateKey);

    const profitTracker = new ProfitTracker();
    const monitor = new WalletMonitor(connection, envConfig.monitoredWallets);
    const trader = new TradeExecutor(
      connection,
      privateKey,
      {
        ...config.tradingConfig,
        customSlippage: envConfig.customSlippage,
        slippageMode: envConfig.slippageMode,
      },
      profitTracker
    );

    // Subscribe to wallet activity
    monitor.subscribe(async (transaction) => {
      await trader.executeTradeBasedOnTarget(transaction);
    });

    // Start monitoring
    await monitor.startMonitoring();
    
    logger.info('Bot started successfully');

    // Log profit stats every hour
    setInterval(() => {
      const stats = profitTracker.getStats();
      logger.info('Trading Performance Stats:', stats);
    }, 60 * 60 * 1000);

    // Handle shutdown
    process.on('SIGINT', () => {
      monitor.stop();
      const finalStats = profitTracker.getStats();
      logger.info('Final Trading Stats:', finalStats);
      process.exit();
    });
  } catch (error) {
    logger.error('Bot initialization failed:', error);
    process.exit(1);
  }
}

main();