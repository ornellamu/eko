import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservationService';
import { sendSuccess } from '../utils/response';

export async function createReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const reservation = await ReservationService.createReservation({
      ...req.body,
      userId
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
