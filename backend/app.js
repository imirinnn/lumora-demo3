import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import env from './config/env.js';
import consultationRoutes from './routes/consultationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// The built website (frontend/dist). When it exists, this server hosts the site too,
// so frontend + backend run as ONE service on one URL (e.g. a single Render Web Service).
const WEB_DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../frontend/dist');

/** Builds the Express app (kept separate from server.js so it can be tested without a network port). */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // Needed behind Render/Railway/Nginx so rate limiting sees the real client IP.
  app.set('trust proxy', 1);

  const serveWebsite = fs.existsSync(path.join(WEB_DIST, 'index.html'));

  app.use(
    helmet({
      // Allow what the website needs: Google Fonts and Unsplash photos. Everything else stays locked down.
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
          connectSrc: ["'self'", ...env.clientOrigins],
          objectSrc: ["'none'"],
          frameAncestors: ["'self'"],
        },
      },
    })
  );
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

  if (serveWebsite) {
    // Hashed build files never change → cache them for a year; index.html is always re-checked.
    app.use('/assets', express.static(path.join(WEB_DIST, 'assets'), { immutable: true, maxAge: '1y' }));
    app.use(express.static(WEB_DIST, { index: false, maxAge: '1h' }));
    // Single-page app: every non-API page (/, /projects/terra-house, /admin …) returns index.html
    app.use((req, res, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
      res.sendFile(path.join(WEB_DIST, 'index.html'));
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
