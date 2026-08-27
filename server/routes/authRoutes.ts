import { Router } from 'express';
import { AuthController, registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Customer Auth
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.loginCustomer);

// Admin Auth
router.post('/admin/login', validateBody(loginSchema), AuthController.loginAdmin);

// Session & Profile
router.get('/me', requireAuth, AuthController.getMe);
router.put('/profile', requireAuth, validateBody(updateProfileSchema), AuthController.updateProfile);
router.put('/change-password', requireAuth, validateBody(changePasswordSchema), AuthController.changePassword);
router.post('/logout', AuthController.logout);

// Admin Guard Protected Test Route
router.get('/admin/verify', requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Admin authorization verified successfully',
    admin: req.user
  });
});

export default router;
