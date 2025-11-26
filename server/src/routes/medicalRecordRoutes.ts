// server/src/routes/medicalRecordRoutes.ts
import { Router } from 'express';
import { createMedicalRecord, getPatientHistory } from '../controllers/medicalRecordController';

const router = Router();

// POST /api/medical-records
router.post('/', createMedicalRecord);

// GET /api/medical-records/history
router.get('/history', getPatientHistory);

export default router;
