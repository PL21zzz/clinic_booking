import { Router } from 'express';
import { getInvoicePreview, createInvoice } from '../controllers/invoiceController';

const router = Router();

router.get('/preview/:appointment_id', getInvoicePreview); // Xem trước tiền
router.post('/pay', createInvoice); // Thu tiền

export default router;
