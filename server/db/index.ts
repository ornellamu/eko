import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Memory/Relational storage fallback for sandbox development when MySQL is not provisioned
class LocalRelationalStorage {
  private data: Record<string, any[]> = {
    users: [],
    admins: [],
    categories: [],
    menu_items: [],
    orders: [],
    order_items: [],
    reservations: [],
    payments: [],
    gallery: [],
    restaurant_settings: [],
    contact_messages: [],
    activity_logs: [],
    notifications: []
  };
  private autoIncrements: Record<string, number> = {
    users: 1,
    admins: 1,
    categories: 1,
    menu_items: 1,
    orders: 1,
    order_items: 1,
    reservations: 1,
    payments: 1,
    gallery: 1,
    restaurant_settings: 1,
    contact_messages: 1,
    activity_logs: 1,
    notifications: 1
  };
  private storageFile: string;

  constructor() {
    const dataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Ignored in read-only environments
      }
    }
    this.storageFile = path.join(dataDir, 'eko_db_store.json');
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.storageFile)) {
        const raw = fs.readFileSync(this.storageFile, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed.data };
        this.autoIncrements = { ...this.autoIncrements, ...parsed.autoIncrements };
      }
    } catch {
      // Use in-memory state
    }
  }

  public save() {
    try {
      fs.writeFileSync(
        this.storageFile,
        JSON.stringify({ data: this.data, autoIncrements: this.autoIncrements }, null, 2),
        'utf-8'
      );
    } catch {
      // Use in-memory persistence
    }
  }

  public getTable(table: string): any[] {
    if (!this.data[table]) {
      this.data[table] = [];
    }
    return this.data[table];
  }

  public setTable(table: string, records: any[]): void {
    this.data[table] = records;
    this.save();
  }

  public insert(table: string, record: any): any {
    const t = this.getTable(table);
    const id = record.id || (this.autoIncrements[table] ? this.autoIncrements[table]++ : t.length + 1);
    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      id,
      created_at: record.created_at || now,
      updated_at: record.updated_at || now
    };
    t.push(newRecord);
    this.save();
    return newRecord;
  }

  public update(table: string, id: number, updates: any): any | null {
    const t = this.getTable(table);
    const idx = t.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    t[idx] = {
      ...t[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return t[idx];
  }

  public delete(table: string, id: number): boolean {
    const t = this.getTable(table);
    const idx = t.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    t.splice(idx, 1);
    this.save();
    return true;
  }

  public findById(table: string, id: number): any | null {
    const t = this.getTable(table);
    return t.find((r) => r.id === id) || null;
  }

  public findOne(table: string, predicate: (row: any) => boolean): any | null {
    const t = this.getTable(table);
    return t.find(predicate) || null;
  }

  public find(table: string, predicate?: (row: any) => boolean): any[] {
    const t = this.getTable(table);
    if (!predicate) return [...t];
    return t.filter(predicate);
  }

  public clearAll() {
    for (const key of Object.keys(this.data)) {
      this.data[key] = [];
      this.autoIncrements[key] = 1;
    }
    this.save();
  }

  public count(table: string, predicate?: (row: any) => boolean): number {
    return this.find(table, predicate).length;
  }
}

export const localStorage = new LocalRelationalStorage();

// MySQL Pool Configuration
let mysqlPool: mysql.Pool | null = null;
let isUsingMySQL = false;

export async function getDbConnection() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const database = process.env.DB_NAME;

  if (host && user && database && !mysqlPool) {
    try {
      mysqlPool = mysql.createPool({
        host,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user,
        password: process.env.DB_PASSWORD || '',
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });
      
      // Test connection
      const connection = await mysqlPool.getConnection();
      await connection.ping();
      connection.release();
      isUsingMySQL = true;
      console.log(`[Database] Successfully connected to MySQL at ${host}:${process.env.DB_PORT || '3306'}/${database}`);
    } catch (err: any) {
      console.warn(`[Database] MySQL connection failed (${err.message}). Defaulting to built-in relational storage.`);
      mysqlPool = null;
      isUsingMySQL = false;
    }
  }

  return { isUsingMySQL, pool: mysqlPool, storage: localStorage };
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDbConnection();
  if (db.isUsingMySQL && db.pool) {
    const [rows] = await db.pool.execute(sql, params);
    return rows as T[];
  }
  
  // Local relational storage handler for sandbox execution
  return executeLocalQuery<T>(sql, params);
}

// Emulate basic SQL queries on the local relational store
function executeLocalQuery<T = any>(sql: string, params: any[] = []): T[] {
  const cleanSql = sql.trim().toUpperCase();
  
  if (cleanSql.startsWith('SELECT')) {
    // Find table name
    const fromMatch = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (!fromMatch) return [] as T[];
    const tableName = fromMatch[1].toLowerCase();
    const rows = localStorage.getTable(tableName);

    // Simple WHERE id = ?
    if (/WHERE\s+id\s*=\s*\?/i.test(sql) && params.length >= 1) {
      const match = rows.find((r) => r.id === Number(params[0]));
      return (match ? [match] : []) as unknown as T[];
    }

    // Simple WHERE email = ?
    if (/WHERE\s+email\s*=\s*\?/i.test(sql) && params.length >= 1) {
      const match = rows.find((r) => r.email === String(params[0]));
      return (match ? [match] : []) as unknown as T[];
    }

    // Simple WHERE username = ?
    if (/WHERE\s+username\s*=\s*\?/i.test(sql) && params.length >= 1) {
      const match = rows.find((r) => r.username === String(params[0]));
      return (match ? [match] : []) as unknown as T[];
    }

    // Simple WHERE category_id = ?
    if (/WHERE\s+category_id\s*=\s*\?/i.test(sql) && params.length >= 1) {
      const matches = rows.filter((r) => r.category_id === Number(params[0]));
      return matches as unknown as T[];
    }

    // Simple WHERE type = ?
    if (/WHERE\s+type\s*=\s*\?/i.test(sql) && params.length >= 1) {
      const matches = rows.filter((r) => r.type === String(params[0]));
      return matches as unknown as T[];
    }

    return [...rows] as unknown as T[];
  }

  return [] as T[];
}

export function getDatabaseStatus() {
  return {
    engine: isUsingMySQL ? 'MySQL (External Pool)' : 'Relational Storage (Embedded Sandbox Engine)',
    isUsingMySQL,
    tables: [
      { name: 'users', count: localStorage.count('users') },
      { name: 'admins', count: localStorage.count('admins') },
      { name: 'categories', count: localStorage.count('categories') },
      { name: 'menu_items', count: localStorage.count('menu_items') },
      { name: 'orders', count: localStorage.count('orders') },
      { name: 'order_items', count: localStorage.count('order_items') },
      { name: 'reservations', count: localStorage.count('reservations') },
      { name: 'payments', count: localStorage.count('payments') },
      { name: 'gallery', count: localStorage.count('gallery') },
      { name: 'restaurant_settings', count: localStorage.count('restaurant_settings') },
      { name: 'contact_messages', count: localStorage.count('contact_messages') },
      { name: 'activity_logs', count: localStorage.count('activity_logs') }
    ]
  };
}
