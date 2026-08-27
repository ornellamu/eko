import { Request, Response } from 'express';
import { getDatabaseStatus, localStorage } from '../db';
import { runMigrationsAndSeed } from '../db/migrations';

export async function getDbStatus(_req: Request, res: Response) {
  try {
    const status = getDatabaseStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to get database status'
    });
  }
}

export async function getTableData(req: Request, res: Response) {
  try {
    const { table } = req.params;
    const allowedTables = [
      'users',
      'admins',
      'categories',
      'menu_items',
      'orders',
      'order_items',
      'reservations',
      'payments',
      'gallery',
      'restaurant_settings',
      'contact_messages',
      'activity_logs'
    ];

    if (!allowedTables.includes(table)) {
      return res.status(400).json({
        success: false,
        error: `Invalid table name '${table}'. Allowed tables: ${allowedTables.join(', ')}`
      });
    }

    const rows = localStorage.getTable(table);
    
    // Mask password hashes for security if users or admins are requested
    const safeRows = rows.map((r) => {
      if (r.password_hash) {
        const { password_hash, ...rest } = r;
        return { ...rest, password_hash: '[PROTECTED_BCRYPT_HASH]' };
      }
      return r;
    });

    res.json({
      success: true,
      table,
      count: safeRows.length,
      data: safeRows
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to retrieve table data'
    });
  }
}

export async function testCrudOperations(_req: Request, res: Response) {
  try {
    const testEmail = `test.customer.${Date.now()}@example.com`;
    
    // 1. CREATE test user
    const createdUser = localStorage.insert('users', {
      full_name: 'Test Customer Kigali',
      email: testEmail,
      phone: '0780000000',
      password_hash: '$2a$10$sampleTestHashForStage2Verification'
    });

    // 2. READ test user
    const fetchedUser = localStorage.findById('users', createdUser.id);
    if (!fetchedUser || fetchedUser.email !== testEmail) {
      throw new Error('Database READ verification failed');
    }

    // 3. UPDATE test user
    const updatedUser = localStorage.update('users', createdUser.id, {
      full_name: 'Updated Test Customer Kigali'
    });
    if (!updatedUser || updatedUser.full_name !== 'Updated Test Customer Kigali') {
      throw new Error('Database UPDATE verification failed');
    }

    // 4. DELETE test user (clean up)
    const deleteSuccess = localStorage.delete('users', createdUser.id);
    if (!deleteSuccess) {
      throw new Error('Database DELETE verification failed');
    }

    res.json({
      success: true,
      message: 'All Database CRUD operations (CREATE, READ, UPDATE, DELETE) verified successfully.',
      testDetails: {
        createdId: createdUser.id,
        createdEmail: testEmail,
        updateVerified: true,
        deleteVerified: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'CRUD operations test failed'
    });
  }
}

export async function resetDatabase(_req: Request, res: Response) {
  try {
    await runMigrationsAndSeed(true);
    res.json({
      success: true,
      message: 'Database reset and re-seeded successfully.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to reset database'
    });
  }
}
