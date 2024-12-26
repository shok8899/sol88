module.exports = {
  apps: [{
    name: 'solana-bot',
    script: 'src/index.js',
    exec_mode: 'fork',
    exp_backoff_restart_delay: 100,
    node_args: [
      '--experimental-modules',
      '--no-warnings'
    ],
    env: {
      NODE_ENV: 'production',
      UV_THREADPOOL_SIZE: '8'
    },
    max_memory_restart: '1G',
    restart_delay: 3000
  }]
};