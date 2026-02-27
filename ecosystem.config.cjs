module.exports = {
  apps: [
    {
      name: 'exchange-app',
      script: 'npm',
      args: 'run start:prod',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        NODE_ENV: 'production',
        PORT: 4100,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4100,
      },
    },
  ],
};
