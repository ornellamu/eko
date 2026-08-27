import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { createServer as createViteServer } from 'vite';
import { config } from './server/config';
import healthRoutes from './server/routes/healthRoutes';
import databaseRoutes from './server/routes/databaseRoutes';
import foundationRoutes from './server/routes/foundationRoutes';
import authRoutes from './server/routes/authRoutes';
import { errorHandler } from './server/middleware/errorHandler';
import { requestLogger } from './server/middleware/logger';
import { runMigrationsAndSeed } from './server/db/migrations';

async function startServer() {
  const app = express();
  const PORT = config.port;

  // Run database migrations and seeds
  await runMigrationsAndSeed();

  // Basic middleware & CORS
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Session middleware configuration
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.isProduction,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  // API Routes
  app.use('/api', healthRoutes);
  app.use('/api/db', databaseRoutes);
  app.use('/api/v1', foundationRoutes);
  app.use('/api/v1/auth', authRoutes);

  // Global Error Handler for API routes
  app.use('/api', errorHandler);

  // Vite middleware for development or Static files for production
  if (config.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Eko Restaurant] Server running on http://0.0.0.0:${PORT} [${config.nodeEnv}]`);
  });
}

startServer().catch((err) => {
  console.error('[Eko Restaurant] Failed to start server:', err);
  process.exit(1);
});
