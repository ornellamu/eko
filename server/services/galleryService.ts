import { localStorage } from '../db';
import { NotFoundError } from '../utils/errors';

export interface GalleryItemData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  display_order: number;
  created_at?: string;
}

export class GalleryService {
  /**
   * Fetch all gallery images
   */
  public static async getGallery(category?: string) {
    let items = localStorage.getTable('gallery');
    if (category && category !== 'all') {
      items = items.filter(
        (i) => i.category && i.category.toLowerCase() === category.toLowerCase()
      );
    }
    return [...items].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }

  /**
   * Add a new gallery image
   */
  public static async addGalleryItem(data: {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    displayOrder?: number;
    adminId?: number;
  }) {
    const item = localStorage.insert('gallery', {
      title: data.title,
      description: data.description,
      image_url: data.imageUrl,
      category: data.category || 'Interior',
      display_order: data.displayOrder || 10,
      created_at: new Date().toISOString()
    });

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: data.adminId || 1,
      action: 'GALLERY_ITEM_ADDED',
      details: JSON.stringify({ id: item.id, title: item.title, category: item.category }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return item;
  }

  /**
   * Update an existing gallery item
   */
  public static async updateGalleryItem(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      imageUrl: string;
      category: string;
      displayOrder: number;
    }>,
    adminId?: number
  ) {
    const item = localStorage.findById('gallery', id);
    if (!item) {
      throw new NotFoundError('Gallery item not found');
    }

    const updates: any = {};
    if (data.title) updates.title = data.title;
    if (data.description) updates.description = data.description;
    if (data.imageUrl) updates.image_url = data.imageUrl;
    if (data.category) updates.category = data.category;
    if (data.displayOrder !== undefined) updates.display_order = data.displayOrder;

    const updated = localStorage.update('gallery', id, updates);

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: adminId || 1,
      action: 'GALLERY_ITEM_UPDATED',
      details: JSON.stringify({ id, title: updated.title }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return updated;
  }

  /**
   * Delete a gallery item
   */
  public static async deleteGalleryItem(id: number, adminId?: number) {
    const item = localStorage.findById('gallery', id);
    if (!item) {
      throw new NotFoundError('Gallery item not found');
    }

    localStorage.delete('gallery', id);

    localStorage.insert('activity_logs', {
      actor_type: 'admin',
      actor_id: adminId || 1,
      action: 'GALLERY_ITEM_DELETED',
      details: JSON.stringify({ id, title: item.title }),
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    });

    return { id, deleted: true };
  }
}
