import bcrypt from 'bcryptjs';
import { localStorage } from '../db';
import { UserRow, AdminRow, ActivityLogRow } from '../db/types';
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors';
import { generateToken, AuthTokenPayload } from '../middleware/auth';

export interface RegisterUserDto {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new customer
   */
  static async registerCustomer(data: RegisterUserDto): Promise<{ user: Omit<UserRow, 'password_hash'>; token: string }> {
    const existingEmail = localStorage.findOne('users', (u: UserRow) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingEmail) {
      throw new ConflictError(`An account with email '${data.email}' already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = localStorage.insert('users', {
      full_name: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      password_hash: passwordHash
    }) as UserRow;

    const payload: AuthTokenPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.full_name,
      role: 'customer'
    };

    const token = generateToken(payload);
    const { password_hash, ...safeUser } = newUser;

    return {
      user: safeUser,
      token
    };
  }

  /**
   * Login as customer
   */
  static async loginCustomer(data: LoginDto): Promise<{ user: Omit<UserRow, 'password_hash'>; token: string }> {
    const email = data.emailOrUsername.toLowerCase().trim();
    const user = localStorage.findOne('users', (u: UserRow) => u.email.toLowerCase() === email) as UserRow | null;

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload: AuthTokenPayload = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: 'customer'
    };

    const token = generateToken(payload);
    const { password_hash, ...safeUser } = user;

    return {
      user: safeUser,
      token
    };
  }

  /**
   * Login as Admin
   */
  static async loginAdmin(data: LoginDto, ipAddress?: string): Promise<{ admin: Omit<AdminRow, 'password_hash'>; token: string }> {
    const identifier = data.emailOrUsername.toLowerCase().trim();
    const admin = localStorage.findOne('admins', (a: AdminRow) => 
      a.email.toLowerCase() === identifier || a.username.toLowerCase() === identifier
    ) as AdminRow | null;

    if (!admin) {
      throw new UnauthorizedError('Invalid admin credentials');
    }

    const isMatch = await bcrypt.compare(data.password, admin.password_hash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid admin credentials');
    }

    const payload: AuthTokenPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.username,
      role: 'admin'
    };

    const token = generateToken(payload, '24h');

    // Log admin login activity
    localStorage.insert('activity_logs', {
      admin_id: admin.id,
      admin_username: admin.username,
      action_type: 'LOGIN',
      record_type: 'AUTH',
      record_id: admin.id,
      description: `Admin '${admin.username}' logged in successfully`,
      ip_address: ipAddress || '127.0.0.1'
    } as Omit<ActivityLogRow, 'id' | 'created_at'>);

    const { password_hash, ...safeAdmin } = admin;

    return {
      admin: safeAdmin,
      token
    };
  }

  /**
   * Get user profile by ID
   */
  static getUserProfile(userId: number): Omit<UserRow, 'password_hash'> {
    const user = localStorage.findById('users', userId) as UserRow | null;
    if (!user) {
      throw new NotFoundError(`User #${userId}`);
    }
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Get admin profile by ID
   */
  static getAdminProfile(adminId: number): Omit<AdminRow, 'password_hash'> {
    const admin = localStorage.findById('admins', adminId) as AdminRow | null;
    if (!admin) {
      throw new NotFoundError(`Admin #${adminId}`);
    }
    const { password_hash, ...safeAdmin } = admin;
    return safeAdmin;
  }

  /**
   * Update Customer Profile
   */
  static updateCustomerProfile(userId: number, data: { fullName?: string; phone?: string }): Omit<UserRow, 'password_hash'> {
    const user = localStorage.findById('users', userId) as UserRow | null;
    if (!user) {
      throw new NotFoundError(`User #${userId}`);
    }

    const updated = localStorage.update('users', userId, {
      ...(data.fullName ? { full_name: data.fullName.trim() } : {}),
      ...(data.phone ? { phone: data.phone.trim() } : {})
    }) as UserRow;

    const { password_hash, ...safeUser } = updated;
    return safeUser;
  }

  /**
   * Change Password
   */
  static async changePassword(
    role: 'customer' | 'admin',
    id: number,
    currentPass: string,
    newPass: string
  ): Promise<void> {
    const table = role === 'admin' ? 'admins' : 'users';
    const account = localStorage.findById(table, id) as (UserRow | AdminRow) | null;

    if (!account) {
      throw new NotFoundError(`${role} #${id}`);
    }

    const isMatch = await bcrypt.compare(currentPass, account.password_hash);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    localStorage.update(table, id, {
      password_hash: passwordHash
    });
  }
}
