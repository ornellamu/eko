import { 
  HealthCheckResponse, 
  SystemInfoResponse, 
  DatabaseStatusResponse, 
  CrudTestResponse,
  CategoryItem,
  MenuItemData,
  PublicInfoResponse,
  ValidateCartResponse,
  AuthResponse,
  ProfileResponse
} from '../types';

export async function fetchHealthStatus(): Promise<HealthCheckResponse> {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error(`Failed to fetch health status: ${response.status}`);
  }
  return response.json();
}

export async function fetchSystemInfo(): Promise<SystemInfoResponse> {
  const response = await fetch('/api/system-info');
  if (!response.ok) {
    throw new Error(`Failed to fetch system info: ${response.status}`);
  }
  return response.json();
}

export async function fetchDatabaseStatus(): Promise<DatabaseStatusResponse> {
  const response = await fetch('/api/db/status');
  if (!response.ok) {
    throw new Error(`Failed to fetch database status: ${response.status}`);
  }
  return response.json();
}

export async function fetchTableData(table: string): Promise<{ success: boolean; table: string; count: number; data: any[] }> {
  const response = await fetch(`/api/db/tables/${table}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch table '${table}': ${response.status}`);
  }
  return response.json();
}

export async function runCrudVerificationTest(): Promise<CrudTestResponse> {
  const response = await fetch('/api/db/test-crud', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`CRUD verification test failed with status: ${response.status}`);
  }
  return response.json();
}

// Stage 3: Foundation API Services
export async function fetchPublicInfo(): Promise<PublicInfoResponse> {
  const response = await fetch('/api/v1/info');
  if (!response.ok) {
    throw new Error(`Failed to fetch public info: ${response.status}`);
  }
  return response.json();
}

export async function fetchCategories(type?: 'food' | 'drink'): Promise<{ success: boolean; data: CategoryItem[] }> {
  const url = type ? `/api/v1/categories?type=${type}` : '/api/v1/categories';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  return response.json();
}

export async function fetchMenuItems(filters?: {
  categoryId?: number;
  type?: 'food' | 'drink';
  isPopular?: boolean;
  search?: string;
}): Promise<{ success: boolean; data: MenuItemData[] }> {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.append('categoryId', String(filters.categoryId));
  if (filters?.type) params.append('type', filters.type);
  if (filters?.isPopular !== undefined) params.append('isPopular', String(filters.isPopular));
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const url = queryString ? `/api/v1/menu?${queryString}` : '/api/v1/menu';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch menu items: ${response.status}`);
  }
  return response.json();
}

export async function testCartValidation(items: Array<{ menuItemId: number; quantity: number }>): Promise<ValidateCartResponse> {
  const response = await fetch('/api/v1/menu/validate-cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  if (!response.ok) {
    const errBody = await response.json();
    throw new Error(errBody.error?.message || `Cart validation failed with status ${response.status}`);
  }
  return response.json();
}

// Stage 4: Authentication API Services
export async function customerRegister(data: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  if (!response.ok) {
    let errMsg = json.error?.message || 'Registration failed';
    if (json.error?.details && Array.isArray(json.error.details)) {
      errMsg = json.error.details.map((d: any) => d.message || `${d.field}: Invalid input`).join(' • ');
    }
    throw new Error(errMsg);
  }
  return json;
}

export async function customerLogin(data: {
  emailOrUsername: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  if (!response.ok) {
    let errMsg = json.error?.message || 'Customer login failed';
    if (json.error?.details && Array.isArray(json.error.details)) {
      errMsg = json.error.details.map((d: any) => d.message || `${d.field}: Invalid input`).join(' • ');
    }
    throw new Error(errMsg);
  }
  return json;
}

export async function adminLogin(data: {
  emailOrUsername: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  if (!response.ok) {
    let errMsg = json.error?.message || 'Admin login failed';
    if (json.error?.details && Array.isArray(json.error.details)) {
      errMsg = json.error.details.map((d: any) => d.message || `${d.field}: Invalid input`).join(' • ');
    }
    throw new Error(errMsg);
  }
  return json;
}

export async function fetchCurrentProfile(token?: string): Promise<ProfileResponse> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch('/api/v1/auth/me', { headers });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error?.message || 'Failed to fetch user profile');
  }
  return json;
}

export const getMe = fetchCurrentProfile;

export async function verifyAdminAccess(token?: string): Promise<{ success: boolean; message: string; admin?: any }> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch('/api/v1/auth/admin/verify', { headers });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error?.message || json.message || 'Forbidden / Unauthorized');
  }
  return json;
}

export async function userLogout(): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/v1/auth/logout', { method: 'POST' });
  return response.json();
}

// -------------------------------------------------------------
// Orders API
// -------------------------------------------------------------
export async function createOrder(data: {
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
  items: Array<{ menuItemId: number; quantity: number; specialInstructions?: string }>;
}, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api/v1/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to place order');
  return json;
}

export async function trackOrder(reference: string) {
  const res = await fetch(`/api/v1/orders/track/${encodeURIComponent(reference)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to find order');
  return json;
}

export async function fetchMyOrders(token: string) {
  const res = await fetch('/api/v1/orders/my-orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to load order history');
  return json;
}

// -------------------------------------------------------------
// Reservations API
// -------------------------------------------------------------
export async function createReservation(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  seatingArea?: 'main_dining' | 'sunset_terrace' | 'vip_suite' | 'any';
  specialRequests?: string;
  occasion?: string;
}, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api/v1/reservations', {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to book reservation');
  return json;
}

export async function lookupReservation(code: string) {
  const res = await fetch(`/api/v1/reservations/lookup/${encodeURIComponent(code)}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Reservation not found');
  return json;
}

export async function fetchMyReservations(token: string) {
  const res = await fetch('/api/v1/reservations/my-reservations', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch reservations');
  return json;
}

// -------------------------------------------------------------
// Admin API
// -------------------------------------------------------------
export async function fetchAdminStats(token: string) {
  const res = await fetch('/api/v1/admin/stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch dashboard stats');
  return json;
}

export async function fetchAdminOrders(token: string, status?: string) {
  const url = status ? `/api/v1/admin/orders?status=${status}` : '/api/v1/admin/orders';
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch orders');
  return json;
}

export async function updateAdminOrderStatus(token: string, orderId: number, status: string, notes?: string) {
  const res = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status, notes })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to update order status');
  return json;
}

export async function fetchAdminReservations(token: string, status?: string) {
  const url = status ? `/api/v1/admin/reservations?status=${status}` : '/api/v1/admin/reservations';
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch reservations');
  return json;
}

export async function updateAdminReservationStatus(token: string, reservationId: number, status: string, adminNotes?: string) {
  const res = await fetch(`/api/v1/admin/reservations/${reservationId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status, adminNotes })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to update reservation status');
  return json;
}

export async function toggleAdminMenuItemAvailability(token: string, id: number) {
  const res = await fetch(`/api/v1/admin/menu-items/${id}/toggle`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to toggle item availability');
  return json;
}

export async function updateAdminMenuItem(token: string, id: number, updates: any) {
  const res = await fetch(`/api/v1/admin/menu-items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to update menu item');
  return json;
}

export async function createAdminMenuItem(token: string, data: any) {
  const res = await fetch('/api/v1/admin/menu-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to create menu item');
  return json;
}

export async function fetchAdminActivityLogs(token: string) {
  const res = await fetch('/api/v1/admin/activity-logs', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch activity logs');
  return json;
}

// -------------------------------------------------------------
// Stage 13: Gallery & Settings API
// -------------------------------------------------------------
export async function fetchPublicGallery(category?: string) {
  const url = category && category !== 'all' ? `/api/v1/gallery?category=${encodeURIComponent(category)}` : '/api/v1/gallery';
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch gallery');
  return json;
}

export async function fetchAdminSettings(token: string) {
  const res = await fetch('/api/v1/admin/settings', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch settings');
  return json;
}

export async function updateAdminSettings(token: string, settings: Record<string, string>) {
  const res = await fetch('/api/v1/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to update settings');
  return json;
}

export async function createAdminGalleryItem(token: string, data: {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  displayOrder?: number;
}) {
  const res = await fetch('/api/v1/admin/gallery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to create gallery item');
  return json;
}

export async function updateAdminGalleryItem(token: string, id: number, data: any) {
  const res = await fetch(`/api/v1/admin/gallery/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to update gallery item');
  return json;
}

export async function deleteAdminGalleryItem(token: string, id: number) {
  const res = await fetch(`/api/v1/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to delete gallery item');
  return json;
}

// -------------------------------------------------------------
// Stage 15 & 16: Diagnostics & Production API
// -------------------------------------------------------------
export async function fetchTestSuiteReport() {
  const res = await fetch('/api/v1/system/test-suite');
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to run test suite');
  return json;
}

export async function fetchProductionCheck() {
  const res = await fetch('/api/v1/system/production-check');
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch production check');
  return json;
}



