import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : (err.statusCode || 500);
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;
  const errorCode = err.name || 'Error';

  if (statusCode >= 500) {
    console.error(`[Server Error] ${statusCode} - ${message}`, err.stack || err);
  } else {
    console.warn(`[Client Warning] ${statusCode} - ${message}`);
  }

  return sendError({
    res,
    statusCode,
    message,
    details,
    errorCode
  });
}
