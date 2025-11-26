import { Router } from 'express';
import { getMedicines, createPrescription, getPrescriptionByAppointment } from '../controllers/prescriptionController';

const router = Router();

// GET /api/prescriptions/medicines
router.get('/medicines', getMedicines);

// POST /api/prescriptions
router.post('/', createPrescription);

// GET /api/prescriptions/:appointment_id
router.get('/:appointment_id', getPrescriptionByAppointment);

export default router;
