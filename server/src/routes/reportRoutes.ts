import { Router } from 'express';
import { getDashboardStats } from '../controllers/reportController';
import { verifyToken, checkRole } from '../middleware/authMiddleware';

const router = Router();

// Chỉ Admin và Bác sĩ được xem thống kê
router.get('/dashboard', verifyToken, checkRole(['admin', 'doctor']), getDashboardStats);

export default router;
