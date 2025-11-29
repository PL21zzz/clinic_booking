import { Router } from 'express';
import { bookAppointment, getAppointments, getMyAppointments } from '../controllers/appointmentController';
import { verifyToken, checkRole } from '../middleware/authMiddleware';

const router = Router();
// GET /api/appointments
router.get('/', verifyToken, checkRole(['cashier', 'admin']), getAppointments);

// GET /api/appointments/my-appointments
router.get('/my-appointments', verifyToken, getMyAppointments);

// POST /api/appointments/book
router.post('/book', verifyToken, bookAppointment);

export default router;
