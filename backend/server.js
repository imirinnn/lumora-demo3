import env from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { createApp } from './app.js';
import { verifyMailSetup } from './services/mailer.js';

async function start() {
  try {
    await connectDB(env.mongoUri);
  } catch (err) {
    console.error('[db] Could not connect to MongoDB:', err.message);
    console.error('     Check MONGODB_URI in backend/.env and that your IP is allowed in Atlas → Network Access.');
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[api] Lumora API running on http://localhost:${env.port} (${env.nodeEnv})`);
    verifyMailSetup();
  });

  const shutdown = (signal) => {
    console.log(`\n[api] ${signal} received, shutting down…`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
