import { localStorage } from '../db';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { MenuItemRow, CategoryRow } from '../db/types';

export class MenuService {
  static getCategories(type?: 'food' | 'drink'): CategoryRow[] {
    const rows = localStorage.getTable('categories') as CategoryRow[];
    return rows
      .filter((c) => (type ? c.type === type : true) && (c.is_active ?? true))
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  static getMenuItems(options?: {
    categoryId?: number;
    type?: 'food' | 'drink';
    isPopular?: boolean;
    search?: string;
  }): MenuItemRow[] {
    let items = localStorage.getTable('menu_items') as MenuItemRow[];
    const categories = localStorage.getTable('categories') as CategoryRow[];
    const catMap = new Map<number, CategoryRow>();
    for (const c of categories) {
      catMap.set(c.id, c);
    }
    
    if (options?.categoryId) {
      items = items.filter((item) => item.category_id === Number(options.categoryId));
    }
    if (options?.type) {
      items = items.filter((item) => item.type === options.type);
    }
    if (options?.isPopular !== undefined) {
      items = items.filter((item) => Boolean(item.is_popular) === options.isPopular);
    }
    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // Sort logically by category display order (First Foods -> Mains -> Desserts -> Drinks)
    return items.sort((a, b) => {
      const catA = catMap.get(a.category_id);
      const catB = catMap.get(b.category_id);
      const orderA = catA?.display_order ?? 99;
      const orderB = catB?.display_order ?? 99;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return (a.id || 0) - (b.id || 0);
    });
  }

  static getMenuItemById(id: number): MenuItemRow {
    const item = localStorage.findById('menu_items', id) as MenuItemRow | null;
    if (!item) {
      throw new NotFoundError(`Menu item #${id}`);
    }
    return item;
  }

  static calculateCartSubtotal(items: Array<{ menuItemId: number; quantity: number }>): {
    items: Array<{ item: MenuItemRow; quantity: number; lineTotal: number }>;
    subtotal: number;
  } {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError('Cart must contain at least one item');
    }

    let subtotal = 0;
    const validatedItems = items.map((cartItem) => {
      const menuItem = localStorage.findById('menu_items', cartItem.menuItemId) as MenuItemRow | null;
      if (!menuItem) {
        throw new NotFoundError(`Menu item #${cartItem.menuItemId}`);
      }
      if (!menuItem.is_available) {
        throw new BadRequestError(`Menu item '${menuItem.name}' is currently unavailable`);
      }
      if (cartItem.quantity < 1) {
        throw new BadRequestError(`Quantity for '${menuItem.name}' must be at least 1`);
      }
      const lineTotal = Number(menuItem.price) * cartItem.quantity;
      subtotal += lineTotal;
      return {
        item: menuItem,
        quantity: cartItem.quantity,
        lineTotal
      };
    });

    return {
      items: validatedItems,
      subtotal
    };
  }
}
