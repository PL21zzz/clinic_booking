import { Router } from 'express';
import { getAllServices, createService } from '../controllers/serviceController';

const router = Router();

// GET /api/services -> Lấy danh sách
router.get('/', getAllServices);

// POST /api/services -> Tạo mới
router.post('/', createService);

export default router;
