import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservationService';
import { sendSuccess } from '../utils/response';
import { UnauthorizedError } from '../utils/errors';

export async function createReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      throw new UnauthorizedError('You must be registered and logged in as a client to reserve a table at Éko Kigali.');
    }

    const reservation = await ReservationService.createReservation({
      ...req.body,
      userId: user.id,
      customerName: req.body.customerName || user.name || user.username,
      customerEmail: req.body.customerEmail || user.email
    });
    return sendSuccess({ res, data: { reservation }, message: 'Table reserved successfully', statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function getReservationByCode(req: Request, res: Response, next: NextFunction) {
  try {
    const code = req.params.code;
    const reservation = await ReservationService.getReservationByCode(code);
    return sendSuccess({ res, data: { reservation }, message: 'Reservation details retrieved' });
  } catch (error) {
    next(error);
  }
}

export async function getMyReservations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const reservations = await ReservationService.getUserReservations(userId);
    return sendSuccess({ res, data: { reservations }, message: 'Customer reservations retrieved' });
  } catch (error) {
    next(error);
  }
}
