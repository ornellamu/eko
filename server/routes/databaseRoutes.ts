import { Router } from 'express';
import { getDbStatus, getTableData, testCrudOperations, resetDatabase } from '../controllers/databaseController';

const router = Router();

router.get('/status', getDbStatus);
router.get('/tables/:table', getTableData);
router.post('/test-crud', testCrudOperations);
router.post('/reset-seed', resetDatabase);

export default router;
