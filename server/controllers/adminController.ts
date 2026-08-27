import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { OrderService } from '../services/orderService';
import { ReservationService } from '../services/reservationService';
import { GalleryService } from '../services/galleryService';
import { SettingsService } from '../services/settingsService';
import { sendSuccess } from '../utils/response';

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await AdminService.getDashboardStats();
    return sendSuccess({ res, data: stats, message: 'Dashboard analytics retrieved' });
  } catch (error) {
    next(error);
  }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined;
    const orders = await OrderService.getAllOrders(status);
    return sendSuccess({ res, data: { orders }, message: 'Orders retrieved' });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const adminId = (req as any).user?.id;
    const updated = await OrderService.updateOrderStatus(orderId, {
      ...req.body,
      adminId
    });
    return sendSuccess({ res, data: { order: updated }, message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
}

export async function getAllReservations(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined;
    const reservations = await ReservationService.getAllReservations(status);
    return sendSuccess({ res, data: { reservations }, message: 'Reservations retrieved' });
  } catch (error) {
    next(error);
  }
}

export async function updateReservationStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const reservationId = parseInt(req.params.id, 10);
    const { status, adminNotes } = req.body;
    const updated = await ReservationService.updateReservationStatus(reservationId, status, adminNotes);
    return sendSuccess({ res, data: { reservation: updated }, message: 'Reservation status updated' });
  } catch (error) {
    next(error);
  }
}

export async function createMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await AdminService.createMenuItem(req.body);
    return sendSuccess({ res, data: { item }, message: 'Menu item created', statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function updateMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await AdminService.updateMenuItem(id, req.body);
    return sendSuccess({ res, data: { item: updated }, message: 'Menu item updated' });
  } catch (error) {
    next(error);
  }
}

export async function toggleMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await AdminService.toggleMenuItemAvailability(id);
    return sendSuccess({ res, data: { item: updated }, message: 'Menu item availability toggled' });
  } catch (error) {
    next(error);
  }
}

export async function getActivityLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const logs = await AdminService.getActivityLogs(limit);
    return sendSuccess({ res, data: { logs }, message: 'Activity logs retrieved' });
  } catch (error) {
    next(error);
  }
}

// Stage 13: Restaurant Settings & Gallery Management
export async function getRestaurantSettings(_req: Request, res: Response, next: NextFunction) {
  try {
    const settings = SettingsService.getAllSettings();
    return sendSuccess({ res, data: { settings }, message: 'Restaurant settings retrieved' });
  } catch (error) {
    next(error);
  }
}

export async function updateRestaurantSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = req.body;
    const keys = Object.keys(settings);
    for (const k of keys) {
      SettingsService.updateSetting(k, String(settings[k]));
    }
    const updated = SettingsService.getAllSettings();
    return sendSuccess({ res, data: { settings: updated }, message: 'Restaurant settings updated successfully' });
  } catch (error) {
    next(error);
  }
}

export async function addGalleryItem(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.id;
    const item = await GalleryService.addGalleryItem({
      ...req.body,
      adminId
    });
    return sendSuccess({ res, data: { item }, message: 'Gallery item added', statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function updateGalleryItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const adminId = (req as any).user?.id;
    const updated = await GalleryService.updateGalleryItem(id, req.body, adminId);
    return sendSuccess({ res, data: { item: updated }, message: 'Gallery item updated' });
  } catch (error) {
    next(error);
  }
}

export async function deleteGalleryItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const adminId = (req as any).user?.id;
    const result = await GalleryService.deleteGalleryItem(id, adminId);
    return sendSuccess({ res, data: result, message: 'Gallery item deleted' });
  } catch (error) {
    next(error);
  }
}
