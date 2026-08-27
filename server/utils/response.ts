import { Response } from 'express';

export interface ApiResponseOptions<T = any> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export function sendSuccess<T = any>({
  res,
  statusCode = 200,
  message,
  data,
  meta
}: ApiResponseOptions<T>) {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(meta ? { meta } : {}),
    timestamp: new Date().toISOString()
  });
}

export function sendError({
  res,
  statusCode = 500,
  message = 'An unexpected error occurred',
  details,
  errorCode
}: {
  res: Response;
  statusCode?: number;
  message?: string;
  details?: any;
  errorCode?: string;
}) {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(errorCode ? { code: errorCode } : {}),
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString()
    }
  });
}
