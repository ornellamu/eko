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
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error?.message || 'Registration failed');
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
    throw new Error(json.error?.message || 'Customer login failed');
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
    throw new Error(json.error?.message || 'Admin login failed');
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

