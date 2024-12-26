import { PublicKey } from '@solana/web3.js';
import { logger } from '../utils/logger.js';
import { CONNECTION_CONSTANTS } from '../utils/constants.js';

export class WalletMonitor {
  constructor(connection, walletAddresses) {
    this.connection = connection;
    this.walletAddresses = walletAddresses.map(addr => new PublicKey(addr));
    this.subscribers = new Set();
    this.isMonitoring = false;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  async startMonitoring() {
    if (this.isMonitoring) {
      logger.warn('Monitoring already active');
      return;
    }

    try {
      this.subscription = this.connection.onLogs(
        'all',
        async (logs) => {
          await this.handleTransaction(logs);
        },
        CONNECTION_CONSTANTS.DEFAULT_COMMITMENT
      );

      this.isMonitoring = true;
      logger.info('Started monitoring wallet addresses');
    } catch (error) {
      logger.error('Failed to start monitoring:', error);
      throw error;
    }
  }

  async handleTransaction(logs) {
    try {
      const signature = logs.signature;
      const tx = await this.connection.getTransaction(
        signature,
        {
          maxSupportedTransactionVersion: 0,
          commitment: CONNECTION_CONSTANTS.DEFAULT_COMMITMENT
        }
      );

      if (!tx) {
        logger.debug(`Transaction ${signature} not found`);
        return;
      }

      const isRelevantTransaction = this.walletAddresses.some(
        addr => tx.transaction.message.accountKeys.some(
          key => key.equals(addr)
        )
      );

      if (isRelevantTransaction) {
        await this.notifySubscribers(tx);
      }
    } catch (error) {
      logger.error('Error handling transaction:', error);
    }
  }

  async notifySubscribers(tx) {
    for (const callback of this.subscribers) {
      try {
        await callback(tx);
      } catch (error) {
        logger.error('Error in transaction callback:', error);
      }
    }
  }

  stop() {
    if (this.subscription) {
      try {
        this.connection.removeOnLogsListener(this.subscription);
        this.isMonitoring = false;
        logger.info('Stopped monitoring wallet addresses');
      } catch (error) {
        logger.error('Error stopping monitor:', error);
      }
    }
  }
}