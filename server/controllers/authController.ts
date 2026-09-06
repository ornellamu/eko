import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';
import { sendSuccess } from '../utils/response';
import { BadRequestError } from '../utils/errors';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address (e.g. user@example.com)'),
  phone: z.string().max(30).optional().default(''),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  emailOrUsername: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, 'Password is required')
}).transform((val) => ({
  emailOrUsername: val.emailOrUsername || val.username || val.email || '',
  password: val.password
})).refine((val) => val.emailOrUsername.length > 0, {
  message: 'Email or username is required',
  path: ['emailOrUsername']
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().max(30).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

export class AuthController {
  /**
   * Customer Registration
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.registerCustomer(req.body);
      
      // Also set cookie and session for convenience
      res.cookie('eko_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      if (req.session) {
        (req.session as any).user = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.full_name,
          role: 'customer'
        };
      }

      return sendSuccess({
        res,
        statusCode: 201,
        message: 'Customer account registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Customer Login
   */
  static async loginCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.loginCustomer(req.body);

      res.cookie('eko_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      if (req.session) {
        (req.session as any).user = {
          id: result.user.id,
          email: result.user.email,
          name: (result.user as any).full_name || (result.user as any).username,
          role: result.user.role || 'customer'
        };
      }

      return sendSuccess({
        res,
        message: 'Customer logged in successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin Login
   */
  static async loginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const result = await AuthService.loginAdmin(req.body, ip);

      res.cookie('eko_admin_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });

      if (req.session) {
        (req.session as any).user = {
          id: result.admin.id,
          email: result.admin.email,
          name: result.admin.username,
          role: 'admin'
        };
      }

      return sendSuccess({
        res,
        message: 'Administrator logged in successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Current Authenticated Profile
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestError('User not authenticated');
      }

      if (req.user.role === 'admin') {
        const admin = AuthService.getAdminProfile(req.user.id);
        return sendSuccess({
          res,
          message: 'Admin profile retrieved',
          data: { user: admin, role: 'admin' }
        });
      } else {
        const customer = AuthService.getUserProfile(req.user.id);
        return sendSuccess({
          res,
          message: 'Customer profile retrieved',
          data: { user: customer, role: 'customer' }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'customer') {
        throw new BadRequestError('Only customer profiles can be updated via this endpoint');
      }

      const updated = AuthService.updateCustomerProfile(req.user.id, req.body);
      return sendSuccess({
        res,
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change Password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestError('Authentication required');
      }

      await AuthService.changePassword(
        req.user.role,
        req.user.id,
        req.body.currentPassword,
        req.body.newPassword
      );

      return sendSuccess({
        res,
        message: 'Password changed successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('eko_token');
      res.clearCookie('eko_admin_token');
      if (req.session) {
        req.session.destroy(() => {});
      }
      return sendSuccess({
        res,
        message: 'Logged out successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}
