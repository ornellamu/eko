import { Router } from 'express';
import { z } from 'zod';
import { createReservation, getReservationByCode, getMyReservations } from '../controllers/reservationController';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = Router();

const reservationSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(8, 'Phone is required'),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  reservationTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time format must be HH:MM'),
  partySize: z.number().int().min(1).max(20),
  seatingArea: z.enum(['main_dining', 'sunset_terrace', 'vip_suite', 'any']).optional(),
  specialRequests: z.string().max(500).optional(),
  occasion: z.string().max(100).optional()
});

// Create table reservation
router.post('/', validateBody(reservationSchema), createReservation);

// Look up reservation by confirmation code
router.get('/lookup/:code', getReservationByCode);

// Customer's reservation history
router.get('/my-reservations', requireAuth, getMyReservations);

export default router;
