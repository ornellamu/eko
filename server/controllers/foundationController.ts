import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { MenuService } from '../services/menuService';
import { SettingsService } from '../services/settingsService';
import { localStorage } from '../db';
import { config } from '../config';

export function getPublicInfo(_req: Request, res: Response, next: NextFunction) {
  try {
    const settings = SettingsService.getAllSettings();
    const categoriesCount = localStorage.getTable('categories').length;
    const menuItemsCount = localStorage.getTable('menu_items').length;
    const galleryCount = localStorage.getTable('gallery').length;

    return sendSuccess({
      res,
      message: 'Eko Restaurant information retrieved successfully',
      data: {
        restaurant: {
          name: settings.restaurant_name || config.restaurant.name,
          slogan: settings.slogan || config.restaurant.slogan,
          location: settings.address || config.restaurant.location,
          phone: settings.phone || config.restaurant.phone,
          whatsapp: settings.whatsapp || config.restaurant.whatsapp,
          email: settings.email || config.restaurant.email,
          openingHours: settings.opening_hours || config.restaurant.openingHours,
          currency: settings.currency || config.restaurant.currency,
          about: settings.about_story || 'Eko Restaurant offers fine dining in Kigali with rich African and continental culinary inspirations.'
        },
        counts: {
          categories: categoriesCount,
          menuItems: menuItemsCount,
          gallery: galleryCount
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const type = req.query.type as 'food' | 'drink' | undefined;
    const categories = MenuService.getCategories(type);
    return sendSuccess({
      res,
      data: categories,
      meta: { count: categories.length, filter: type || 'all' }
    });
  } catch (err) {
    next(err);
  }
}

export function getMenuItems(req: Request, res: Response, next: NextFunction) {
  try {
    const { categoryId, type, isPopular, search } = req.query;
    const items = MenuService.getMenuItems({
      categoryId: categoryId ? Number(categoryId) : undefined,
      type: type as 'food' | 'drink' | undefined,
      isPopular: isPopular !== undefined ? isPopular === 'true' : undefined,
      search: search ? String(search) : undefined
    });
    return sendSuccess({
      res,
      data: items,
      meta: { count: items.length }
    });
  } catch (err) {
    next(err);
  }
}

export function getMenuItemDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const item = MenuService.getMenuItemById(id);
    return sendSuccess({
      res,
      data: item
    });
  } catch (err) {
    next(err);
  }
}

export function getGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    let gallery = localStorage.getTable('gallery');
    if (category && category !== 'all') {
      gallery = gallery.filter((g: any) => g.category?.toLowerCase() === category.toLowerCase());
    }
    gallery.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
    return sendSuccess({
      res,
      data: gallery,
      meta: { count: gallery.length }
    });
  } catch (err) {
    next(err);
  }
}

export function submitContact(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    const inserted = localStorage.insert('contact_messages', {
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject.trim(),
      message: message.trim(),
      is_read: 0,
      responded_at: null
    });
    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Your message has been received by the Eko Restaurant team. We will contact you promptly.',
      data: inserted
    });
  } catch (err) {
    next(err);
  }
}

export function validateCartPrice(req: Request, res: Response, next: NextFunction) {
  try {
    const { items } = req.body;
    const result = MenuService.calculateCartSubtotal(items);
    return sendSuccess({
      res,
      message: 'Cart validated and calculated server-side',
      data: result
    });
  } catch (err) {
    next(err);
  }
}

// Stage 15: Full System Automated Test Suite
export async function runTestSuite(_req: Request, res: Response, next: NextFunction) {
  try {
    const { TestSuiteService } = await import('../services/testSuiteService');
    const report = await TestSuiteService.runFullSystemTests();
    return sendSuccess({
      res,
      message: `System Diagnostics Completed — ${report.overallStatus} (${report.passedCount}/${report.totalTests} tests passed)`,
      data: report
    });
  } catch (err) {
    next(err);
  }
}

// Stage 16: Production Readiness Verification
export async function getProductionCheck(_req: Request, res: Response, next: NextFunction) {
  try {
    const { TestSuiteService } = await import('../services/testSuiteService');
    const readiness = TestSuiteService.getProductionReadinessReport();
    return sendSuccess({
      res,
      message: 'Production readiness report generated',
      data: readiness
    });
  } catch (err) {
    next(err);
  }
}
