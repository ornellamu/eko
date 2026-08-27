import { localStorage } from '../db';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { MenuService } from './menuService';

export interface CreateOrderItemDTO {
  menuItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface CreateOrderDTO {
  userId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup' | 'dine_in';
  deliveryAddress?: string;
  deliveryLandmark?: string;
  deliveryNotes?: string;
  tableNumber?: string;
  paymentMethod: 'momo' | 'airtel' | 'card' | 'cash';
  paymentPhone?: string;
  items: CreateOrderItemDTO[];
}

export interface UpdateOrderStatusDTO {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
  notes?: string;
  adminId?: number;
}

export class OrderService {
  /**
   * Generates a unique luxury order reference code (e.g. EKO-2026-8942)
   */
  private static generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `EKO-${year}-${random}`;
  }

  /**
   * Calculate delivery fee for Kigali zones
   */
  public static calculateDeliveryFee(orderType: 'delivery' | 'pickup' | 'dine_in', _address?: string): number {
    if (orderType !== 'delivery') return 0;
    // Standard Kigali delivery fee
    return 3000;
  }

  /**
   * Create a new order with validated pricing
   */
  public static async createOrder(dto: CreateOrderDTO) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestError('Order must contain at least one item');
    }

    // Validate all items and calculate totals
    let subtotal = 0;
    const validatedItems: Array<{
      menuItem: any;
      quantity: number;
      price: number;
      subtotal: number;
      specialInstructions?: string;
    }> = [];

    for (const itemDto of dto.items) {
      const menuItem = await MenuService.getMenuItemById(itemDto.menuItemId);
      if (!menuItem.is_available) {
        throw new BadRequestError(`"${menuItem.name}" is currently unavailable`);
      }
      const itemSubtotal = menuItem.price * itemDto.quantity;
      subtotal += itemSubtotal;
      validatedItems.push({
        menuItem,
        quantity: itemDto.quantity,
        price: menuItem.price,
        subtotal: itemSubtotal,
        specialInstructions: itemDto.specialInstructions
      });
    }

    const deliveryFee = this.calculateDeliveryFee(dto.orderType, dto.deliveryAddress);
    const tax = Math.round(subtotal * 0.18); // 18% Rwanda VAT for reference
    const totalAmount = subtotal + deliveryFee;

    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();

    // 1. Insert order record
    const order = localStorage.insert('orders', {
      order_number: orderNumber,
      user_id: dto.userId || null,
      customer_name: dto.customerName,
      customer_email: dto.customerEmail,
      customer_phone: dto.customerPhone,
      order_type: dto.orderType,
      status: 'confirmed', // Auto-confirm on valid order
      subtotal_amount: subtotal,
      delivery_fee: deliveryFee,
      tax_amount: tax,
      discount_amount: 0,
      total_amount: totalAmount,
      delivery_address: dto.deliveryAddress || null,
      delivery_landmark: dto.deliveryLandmark || null,
      delivery_notes: dto.deliveryNotes || null,
      table_number: dto.tableNumber || null,
      estimated_time_minutes: dto.orderType === 'delivery' ? 45 : 25,
      created_at: now,
      updated_at: now
    });

    // 2. Insert order items
    for (const vItem of validatedItems) {
      localStorage.insert('order_items', {
        order_id: order.id,
        menu_item_id: vItem.menuItem.id,
        item_name: vItem.menuItem.name,
        unit_price: vItem.price,
        quantity: vItem.quantity,
        subtotal: vItem.subtotal,
        special_instructions: vItem.specialInstructions || null,
        created_at: now
      });
    }

    // 3. Insert payment record
    const payment = localStorage.insert('payments', {
      order_id: order.id,
      payment_method: dto.paymentMethod,
      amount: totalAmount,
      currency: 'RWF',
      status: dto.paymentMethod === 'cash' ? 'pending' : 'completed',
      transaction_reference: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      payment_phone: dto.paymentPhone || dto.customerPhone,
      created_at: now
    });

    // 4. Log activity
    localStorage.insert('activity_logs', {
      actor_type: dto.userId ? 'user' : 'guest',
      actor_id: dto.userId || null,
      action: 'ORDER_PLACED',
      details: JSON.stringify({
        orderNumber,
        totalAmount,
        orderType: dto.orderType,
        paymentMethod: dto.paymentMethod
      }),
      ip_address: '127.0.0.1',
      created_at: now
    });

    return {
      order: {
        ...order,
        items: validatedItems.map(i => ({
          name: i.menuItem.name,
          price: i.price,
          quantity: i.quantity,
          subtotal: i.subtotal,
          image_url: i.menuItem.image_url
        })),
        payment: {
          method: payment.payment_method,
          status: payment.status,
          reference: payment.transaction_reference
        }
      }
    };
  }

  /**
   * Get order by order reference number (public tracking)
   */
  public static async getOrderByReference(reference: string) {
    const order = localStorage.findOne('orders', (o: any) => o.order_number.toUpperCase() === reference.toUpperCase());
    if (!order) {
      throw new NotFoundError(`Order with reference "${reference}" not found`);
    }

    const items = localStorage.find('order_items', (i: any) => i.order_id === order.id);
    const payment = localStorage.findOne('payments', (p: any) => p.order_id === order.id);

    return {
      ...order,
      items,
      payment: payment ? {
        method: payment.payment_method,
        status: payment.status,
        reference: payment.transaction_reference
      } : null
    };
  }

  /**
   * Get orders for a specific logged-in user
   */
  public static async getUserOrders(userId: number) {
    const orders = localStorage.find('orders', (o: any) => o.user_id === userId);
    // Sort descending by created_at
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return orders.map(order => {
      const items = localStorage.find('order_items', (i: any) => i.order_id === order.id);
      const payment = localStorage.findOne('payments', (p: any) => p.order_id === order.id);
      return {
        ...order,
        items,
        payment
      };
    });
  }

  /**
   * Get all orders (Admin)
   */
  public static async getAllOrders(statusFilter?: string) {
    let orders = localStorage.getTable('orders');
    if (statusFilter && statusFilter !== 'all') {
      orders = orders.filter((o: any) => o.status === statusFilter);
    }
    // Sort descending
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return orders.map(order => {
      const items = localStorage.find('order_items', (i: any) => i.order_id === order.id);
      const payment = localStorage.findOne('payments', (p: any) => p.order_id === order.id);
      return {
        ...order,
        items,
        payment
      };
    });
  }

  /**
   * Update order status (Admin)
   */
  public static async updateOrderStatus(orderId: number, dto: UpdateOrderStatusDTO) {
    const order = localStorage.findById('orders', orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const updated = localStorage.update('orders', orderId, {
      status: dto.status,
      admin_notes: dto.notes || order.admin_notes
    });

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: dto.adminId || 1,
      action: 'ORDER_STATUS_UPDATED',
      details: JSON.stringify({ orderId, orderNumber: order.order_number, newStatus: dto.status }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return updated;
  }
}
