export interface RestaurantInfo {
  name: string;
  type?: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  currency: string;
  slogan: string;
  about?: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  stage: string;
  environment: string;
  timestamp: string;
  restaurant: RestaurantInfo;
}

export interface SystemInfoResponse {
  success: boolean;
  data: {
    uptime: number;
    memoryUsage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };
    nodeVersion: string;
    timestamp: string;
  };
}

export interface ProjectStage {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
}

export interface TableSummary {
  name: string;
  count: number;
}

export interface DatabaseStatusResponse {
  success: boolean;
  data: {
    engine: string;
    isUsingMySQL: boolean;
    tables: TableSummary[];
  };
}

export interface CrudTestResponse {
  success: boolean;
  message: string;
  testDetails?: {
    createdId: number;
    createdEmail: string;
    updateVerified: boolean;
    deleteVerified: boolean;
    timestamp: string;
  };
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  type: 'food' | 'drink';
  display_order: number;
  is_active: boolean;
}

export interface MenuItemData {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  type: 'food' | 'drink';
  is_available: boolean;
  is_popular: boolean;
  is_chef_special?: boolean;
  spicy_level?: number;
  prep_time_minutes?: number;
  is_vegetarian?: boolean;
  calories?: number;
}

export interface PublicInfoResponse {
  success: boolean;
  message: string;
  data: {
    restaurant: RestaurantInfo;
    counts: {
      categories: number;
      menuItems: number;
      gallery: number;
    };
  };
}

export interface ValidateCartResponse {
  success: boolean;
  message: string;
  data: {
    items: Array<{
      item: MenuItemData;
      quantity: number;
      lineTotal: number;
    }>;
    subtotal: number;
  };
}

export interface AuthUser {
  id: number;
  full_name?: string;
  username?: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user?: AuthUser;
    admin?: AuthUser;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    role: 'customer' | 'admin';
  };
}

export type PageView = 'home' | 'menu' | 'reservation' | 'about' | 'gallery' | 'contact' | 'admin' | 'auth' | 'track' | 'account' | 'dashboard';

export interface CartItem {
  menu_item: MenuItemData;
  quantity: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  menu_item_id: number;
  item_name?: string;
  unit_price?: number;
  quantity: number;
  subtotal?: number;
  image_url?: string;
  special_instructions?: string;
}

export interface OrderData {
  id: number;
  order_number: string;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: 'delivery' | 'pickup' | 'dine_in';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';
  subtotal_amount: number;
  delivery_fee: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  delivery_address?: string;
  delivery_landmark?: string;
  delivery_notes?: string;
  table_number?: string;
  estimated_time_minutes?: number;
  admin_notes?: string;
  items?: any[];
  payment?: {
    method: string;
    status: string;
    reference: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ReservationData {
  id: number;
  reservation_code: string;
  user_id?: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  seating_area: 'main_dining' | 'sunset_terrace' | 'vip_suite' | 'any';
  special_requests?: string;
  occasion?: string;
  status: 'confirmed' | 'seated' | 'cancelled' | 'completed';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  totalRevenueRwf: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
  totalReservationsCount: number;
  todayReservationsCount: number;
  menuItemsCount: number;
  activeMenuItemsCount: number;
  registeredCustomersCount: number;
}


