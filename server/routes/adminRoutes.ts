import { Router } from 'express';
import { z } from 'zod';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllReservations,
  updateReservationStatus,
  createMenuItem,
  updateMenuItem,
  toggleMenuItem,
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
  status: z.enum(['confirmed', 'seated', 'cancelled', 'completed']),
  adminNotes: z.string().optional()
});
router.put('/reservations/:id/status', validateBody(updateReservationSchema), updateReservationStatus);

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
