import { Router } from 'express';
import { z } from 'zod';
import { 
  getPublicInfo, 
  getCategories, 
  getMenuItems, 
  getMenuItemDetail, 
  validateCartPrice,
  getGallery,
  submitContact,
  runTestSuite,
  getProductionCheck
} from '../controllers/foundationController';
import { validateBody, validateQuery } from '../middleware/validate';

const router = Router();

// Stage 15 & 16: Diagnostics & Production Checks
router.get('/system/test-suite', runTestSuite);
router.get('/system/production-check', getProductionCheck);

// 1. Restaurant public info
router.get('/info', getPublicInfo);

// 2. Gallery
router.get('/gallery', getGallery);

// 3. Contact message submission
const contactSchema = z.object({
  fullName: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2, 'Subject is required').max(150),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
});
router.post('/contact', validateBody(contactSchema), submitContact);

// 4. Categories with optional type filter
const categoryQuerySchema = z.object({
  type: z.enum(['food', 'drink']).optional()
});
router.get('/categories', validateQuery(categoryQuerySchema), getCategories);

// 3. Menu items with search & filters
const menuQuerySchema = z.object({
  categoryId: z.string().optional(),
  type: z.enum(['food', 'drink']).optional(),
  isPopular: z.string().optional(),
  search: z.string().optional()
});
router.get('/menu', validateQuery(menuQuerySchema), getMenuItems);

// 4. Menu item detail
router.get('/menu/:id', getMenuItemDetail);

// 5. Server-side cart validation & pricing engine test
const cartValidationSchema = z.object({
  items: z.array(
    z.object({
      menuItemId: z.number().int().positive(),
      quantity: z.number().int().min(1)
    })
  ).min(1, 'At least 1 item is required')
});
router.post('/menu/validate-cart', validateBody(cartValidationSchema), validateCartPrice);

export default router;
