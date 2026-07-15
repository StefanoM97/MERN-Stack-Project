module.exports = {
  apps: [
    {
      name: "reusehub-api",
      cwd: "/var/www/reusehub/server",
      script: "src/server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 5000
      },
      max_memory_restart: "500M",
      time: true
    }
  ]
};
