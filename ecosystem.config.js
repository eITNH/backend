module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: 'Solar System',
      script: './server.js',
      watch: true,
      ignore_watch: ['node_modules', 'uploads'],
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        PORT: 55573,
        NODE_ENV: 'production',
      },
    },
  ],
};
