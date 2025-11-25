import { Router } from 'express';
import { bookAppointment, getAppointments } from '../controllers/appointmentController';

const router = Router();
// GET /api/appointments
router.get('/', getAppointments);

// POST /api/appointments/book
router.post('/book', bookAppointment);

export default router;
