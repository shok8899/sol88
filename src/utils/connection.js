import { Connection } from '@solana/web3.js';
import { getEnvConfig } from './env.js';
import { logger } from './logger.js';
import { CONNECTION_CONSTANTS } from './constants.js';

export const createConnection = () => {
  const { rpcEndpoint } = getEnvConfig();
  
  // 使用备用节点列表
  const endpoints = [
    rpcEndpoint,
    'https://solana-api.projectserum.com',
    'https://rpc.ankr.com/solana',
    CONNECTION_CONSTANTS.FALLBACK_RPC
  ];

  // 尝试连接直到成功
  for (const endpoint of endpoints) {
    try {
      logger.info(`Attempting to connect to RPC endpoint: ${endpoint}`);
      
      const connection = new Connection(endpoint, {
        commitment: CONNECTION_CONSTANTS.DEFAULT_COMMITMENT,
        wsEndpoint: endpoint.replace(/^http/, 'ws'),
        confirmTransactionInitialTimeout: CONNECTION_CONSTANTS.DEFAULT_TIMEOUT,
        httpHeaders: {
          'Origin': 'https://phantom.app'  // 模拟Phantom钱包
        }
      });

      // 测试连接
      await connection.getSlot();
      logger.info(`Successfully connected to ${endpoint}`);
      return connection;
    } catch (error) {
      logger.warn(`Failed to connect to ${endpoint}: ${error.message}`);
    }
  }

  throw new Error('Failed to connect to any RPC endpoint');
};