import { Router } from 'express';
import { z } from 'zod';
import { createOrder, getOrderByReference, getMyOrders } from '../controllers/orderController';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = Router();

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(8, 'Phone number is required'),
  orderType: z.enum(['delivery', 'pickup', 'dine_in']),
  deliveryAddress: z.string().optional(),
  deliveryLandmark: z.string().optional(),
  deliveryNotes: z.string().optional(),
  tableNumber: z.string().optional(),
  paymentMethod: z.enum(['momo', 'airtel', 'card', 'cash']),
  paymentPhone: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.number().int().positive(),
      quantity: z.number().int().min(1),
      specialInstructions: z.string().optional()
    })
  ).min(1, 'Order must contain at least one item')
});

// Create new order (guest or customer)
router.post('/', validateBody(createOrderSchema), createOrder);

// Track order by reference code
router.get('/track/:reference', getOrderByReference);

// Customer's order history
router.get('/my-orders', requireAuth, getMyOrders);

export default router;
