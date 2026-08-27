import { Router } from 'express';
import { getHealthStatus, getSystemInfo } from '../controllers/healthController';

const router = Router();

router.get('/health', getHealthStatus);
router.get('/system-info', getSystemInfo);

export default router;
