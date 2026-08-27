import { Request, Response } from 'express';
import { config } from '../config';

export function getHealthStatus(_req: Request, res: Response) {
  res.json({
    status: 'ok',
    service: 'Eko Restaurant API',
    stage: 'Stage 1 - Project Initialization',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    restaurant: {
      name: config.restaurant.name,
      location: config.restaurant.location,
      phone: config.restaurant.phone,
      email: config.restaurant.email,
      currency: config.restaurant.currency,
      openingHours: config.restaurant.openingHours,
      slogan: config.restaurant.slogan
    }
  });
}

export function getSystemInfo(_req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    }
  });
}
