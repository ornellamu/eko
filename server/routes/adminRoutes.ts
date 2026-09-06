import { Router } from 'express';
import { z } from 'zod';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllReservations,
  updateReservationStatus,
  createReservationAdmin,
  deleteReservation,
  createMenuItem,
  updateMenuItem,
  toggleMenuItem,
  deleteMenuItem,
  getActivityLogs,
  getRestaurantSettings,
  updateRestaurantSettings,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/adminController';
import { validateBody } from '../middleware/validate';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Protect ALL admin routes with requireAdmin middleware
router.use(requireAdmin);

// Analytics
router.get('/stats', getDashboardStats);

// Order Management
router.get('/orders', getAllOrders);
const updateOrderSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled']),
  notes: z.string().optional()
});
router.put('/orders/:id/status', validateBody(updateOrderSchema), updateOrderStatus);

// Reservation Management
router.get('/reservations', getAllReservations);
const updateReservationSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'seated', 'cancelled', 'completed', 'rejected']),
  adminNotes: z.string().optional(),
  tableNumber: z.string().optional()
});
router.put('/reservations/:id/status', validateBody(updateReservationSchema), updateReservationStatus);

const adminReservationSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required').optional().default('guest@eko-kigali.rw'),
  customerPhone: z.string().min(8, 'Phone is required'),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time format must be HH:MM'),
  partySize: z.number().int().min(1).max(25),
  seatingArea: z.enum(['main_dining', 'sunset_terrace', 'vip_suite', 'any']).optional(),
  tableNumber: z.string().optional(),
  specialRequests: z.string().max(500).optional(),
  occasion: z.string().max(100).optional(),
  status: z.enum(['pending', 'confirmed', 'seated']).optional().default('confirmed')
});
router.post('/reservations', validateBody(adminReservationSchema), createReservationAdmin);
router.delete('/reservations/:id', deleteReservation);

// Menu Items Management
const createMenuSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.number().int().positive(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
  isChefSpecial: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  spicyLevel: z.number().min(0).max(3).optional(),
  prepTimeMinutes: z.number().min(5).max(120).optional()
});
router.post('/menu-items', validateBody(createMenuSchema), createMenuItem);
router.put('/menu-items/:id', updateMenuItem);
router.patch('/menu-items/:id/toggle', toggleMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);

// Activity Logs
router.get('/activity-logs', getActivityLogs);

// Stage 13: Restaurant Settings & Gallery Admin Management
router.get('/settings', getRestaurantSettings);
router.put('/settings', updateRestaurantSettings);

const gallerySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  imageUrl: z.string().url(),
  category: z.string(),
  displayOrder: z.number().optional()
});
router.post('/gallery', validateBody(gallerySchema), addGalleryItem);
router.put('/gallery/:id', updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

export default router;
