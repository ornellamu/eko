import { localStorage } from '../db';
import { NotFoundError } from '../utils/errors';

export class AdminService {
  /**
   * Get overview statistics for the executive admin dashboard
   */
  public static async getDashboardStats() {
    const orders = localStorage.getTable('orders');
    const reservations = localStorage.getTable('reservations');
    const menuItems = localStorage.getTable('menu_items');
    const users = localStorage.getTable('users');

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed' || o.status === 'confirmed');
    const pendingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'out_for_delivery');
    
    // Reservations today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.reservation_date === todayStr);

    const activeMenuItems = menuItems.filter(m => m.is_available);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);

    const recentLogs = [...localStorage.getTable('activity_logs')]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return {
      metrics: {
        totalRevenueRwf: totalRevenue,
        totalOrdersCount: orders.length,
        pendingOrdersCount: pendingOrders.length,
        completedOrdersCount: completedOrders.length,
        totalReservationsCount: reservations.length,
        todayReservationsCount: todayReservations.length,
        menuItemsCount: menuItems.length,
        activeMenuItemsCount: activeMenuItems.length,
        registeredCustomersCount: users.length
      },
      recentOrders,
      recentLogs
    };
  }

  /**
   * Add a new menu item
   */
  public static async createMenuItem(data: {
    categoryId: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    isChefSpecial?: boolean;
    isPopular?: boolean;
    spicyLevel?: number;
    prepTimeMinutes?: number;
  }) {
    const item = localStorage.insert('menu_items', {
      category_id: data.categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      image_url: data.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      is_available: data.isAvailable !== undefined ? data.isAvailable : true,
      is_chef_special: data.isChefSpecial || false,
      is_popular: data.isPopular || false,
      spicy_level: data.spicyLevel || 0,
      prep_time_minutes: data.prepTimeMinutes || 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: 1,
      action: 'MENU_ITEM_CREATED',
      details: JSON.stringify({ id: item.id, name: item.name, price: item.price }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return item;
  }

  /**
   * Update a menu item (price, name, description, availability, etc.)
   */
  public static async updateMenuItem(id: number, updates: any) {
    const item = localStorage.findById('menu_items', id);
    if (!item) {
      throw new NotFoundError('Menu item not found');
    }

    const updated = localStorage.update('menu_items', id, updates);

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: 1,
      action: 'MENU_ITEM_UPDATED',
      details: JSON.stringify({ id, updates }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return updated;
  }

  /**
   * Toggle menu item availability
   */
  public static async toggleMenuItemAvailability(id: number) {
    const item = localStorage.findById('menu_items', id);
    if (!item) {
      throw new NotFoundError('Menu item not found');
    }

    const newStatus = !item.is_available;
    const updated = localStorage.update('menu_items', id, { is_available: newStatus });

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: 1,
      action: 'MENU_ITEM_AVAILABILITY_TOGGLED',
      details: JSON.stringify({ id, name: item.name, is_available: newStatus }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return updated;
  }

  /**
   * Get activity logs
   */
  public static async getActivityLogs(limit = 50) {
    const logs = localStorage.getTable('activity_logs');
    logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return logs.slice(0, limit);
  }
}
