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
import orderRoutes from './server/routes/orderRoutes';
import reservationRoutes from './server/routes/reservationRoutes';
import adminRoutes from './server/routes/adminRoutes';
import { errorHandler } from './server/middleware/errorHandler';
import { requestLogger } from './server/middleware/logger';
import { securityHeaders, sanitizeInputs, rateLimiter } from './server/middleware/security';
import { runMigrationsAndSeed } from './server/db/migrations';

async function startServer() {
  const app = express();
  const PORT = config.port;

  // Run database migrations and seeds
  await runMigrationsAndSeed();

  // Stage 14: Security Headers
  app.use(securityHeaders);

  // Basic middleware & CORS
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));
  
  // Stage 14: Input Sanitization
  app.use(sanitizeInputs);

  // Request logger
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

  // Rate limiters for sensitive endpoints (Stage 14)
  const authLimiter = rateLimiter({ maxRequests: 60, windowMs: 60 * 1000, message: 'Too many authentication attempts. Please wait a minute.' });
  const orderLimiter = rateLimiter({ maxRequests: 100, windowMs: 60 * 1000, message: 'Order submission limit reached. Please wait a moment.' });

  // API Routes
  app.use('/api', healthRoutes);
  app.use('/api/db', databaseRoutes);
  app.use('/api/v1', foundationRoutes);
  app.use('/api/v1/auth', authLimiter, authRoutes);
  app.use('/api/v1/orders', orderLimiter, orderRoutes);
  app.use('/api/v1/reservations', reservationRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // Serve static assets from public folder
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Global Error Handler for API routes
  app.use(errorHandler);

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
