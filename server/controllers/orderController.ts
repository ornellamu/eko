import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService';
import { sendSuccess } from '../utils/response';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const result = await OrderService.createOrder({
      ...req.body,
      userId
    });
    return sendSuccess({ res, data: result, message: 'Order placed successfully', statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function getOrderByReference(req: Request, res: Response, next: NextFunction) {
  try {
    const reference = req.params.reference;
    const order = await OrderService.getOrderByReference(reference);
    return sendSuccess({ res, data: { order }, message: 'Order tracking info retrieved' });
  } catch (error) {
    next(error);
  }
}

export async function getMyOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const orders = await OrderService.getUserOrders(userId);
    return sendSuccess({ res, data: { orders }, message: 'Customer orders retrieved' });
  } catch (error) {
    next(error);
  }
}
