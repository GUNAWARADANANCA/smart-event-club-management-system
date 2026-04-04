require('./config/loadEnv');

const http = require('http');
const app = require('./app');
const { connectDb, disconnectDb } = require('./config/db');

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  try {
    await connectDb();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`[HTTP] Server listening on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`[HTTP] ${signal} received, closing...`);
      server.close(async () => {
        await disconnectDb();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('[Startup] Failed:', err.message || err);
    process.exitCode = 1;
  }
}

start();
