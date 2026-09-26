import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import env from './config/env.js';
import consultationRoutes from './routes/consultationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

/** Builds the Express app (kept separate from server.js so it can be tested without a network port). */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // Needed behind Render/Railway/Nginx so rate limiting sees the real client IP.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin tools (curl, health checks) and configured frontends only.
        if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
        cb(null, false);
      },
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    })
  );
  app.use(express.json({ limit: '20kb' }));

  app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
  app.use('/api/consultations', consultationRoutes);
  app.use('/api/auth', authRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
