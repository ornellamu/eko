import { Request, Response, NextFunction } from 'express';
import { GalleryService } from '../services/galleryService';
import { sendSuccess } from '../utils/response';

export async function getPublicGallery(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const gallery = await GalleryService.getGallery(category);
    return sendSuccess({ res, data: { gallery }, message: 'Gallery photos retrieved' });
  } catch (error) {
    next(error);
  }
}
