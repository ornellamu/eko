import { localStorage } from '../db';
import { NotFoundError } from '../utils/errors';

export class SettingsService {
  static getAllSettings(): Record<string, string> {
    const rows = localStorage.getTable('restaurant_settings');
    const settingsMap: Record<string, string> = {};
    for (const row of rows) {
      settingsMap[row.setting_key] = row.setting_value;
    }
    return settingsMap;
  }

  static getSettingByKey(key: string): string {
    const rows = localStorage.getTable('restaurant_settings');
    const item = rows.find((r) => r.setting_key === key);
    if (!item) {
      throw new NotFoundError(`Setting '${key}'`);
    }
    return item.setting_value;
  }

  static updateSetting(key: string, value: string): void {
    const rows = localStorage.getTable('restaurant_settings');
    const existing = rows.find((r) => r.setting_key === key);
    if (existing) {
      localStorage.update('restaurant_settings', existing.id, { setting_value: value });
    } else {
      localStorage.insert('restaurant_settings', {
        setting_key: key,
        setting_value: value,
        description: `Custom setting for ${key}`
      });
    }
  }
}
