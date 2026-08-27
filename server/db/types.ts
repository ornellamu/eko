export type ItemType = 'food' | 'drink';
export type OrderType = 'delivery' | 'pickup';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Refunded';
export type PaymentMethod = 'MTN Mobile Money' | 'Airtel Money' | 'Visa' | 'Mastercard' | 'Cash on Delivery' | 'Cash at Restaurant';
export type ReservationStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Completed';

export interface UserRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AdminRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  type: ItemType;
  display_order: number;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
}

export interface MenuItemRow {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  type: ItemType;
  is_available: boolean | number;
  is_popular: boolean | number;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

export interface OrderRow {
  id: number;
  order_number: string;
  user_id: number;
  order_type: OrderType;
  delivery_address: string | null;
  delivery_distance_km: number;
  delivery_fee: number;
  subtotal: number;
  total_amount: number;
  phone: string;
  special_instructions: string | null;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
}

export interface OrderItemRow {
  id: number;
  order_id: number;
  menu_item_id: number;
  item_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface ReservationRow {
  id: number;
  reservation_code: string;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  special_request: string | null;
  status: ReservationStatus;
  table_number: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow {
  id: number;
  payment_reference: string;
  order_id: number;
  user_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: PaymentStatus;
  provider_transaction_id: string | null;
  provider_response: any;
  created_at: string;
  updated_at: string;
}

export interface GalleryRow {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantSettingRow {
  id: number;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_at: string;
}

export interface ContactMessageRow {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean | number;
  responded_at: string | null;
  created_at: string;
}

export interface ActivityLogRow {
  id: number;
  admin_id: number | null;
  admin_username: string;
  action_type: string;
  record_type: string;
  record_id: number | null;
  description: string;
  ip_address: string | null;
  created_at: string;
}
