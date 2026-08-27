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

export type PageView = 'home' | 'menu' | 'reservation' | 'about' | 'gallery' | 'contact' | 'admin' | 'auth';

export interface CartItem {
  menu_item: MenuItemData;
  quantity: number;
}

