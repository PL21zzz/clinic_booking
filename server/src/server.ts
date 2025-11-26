import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serviceRoutes from './routes/serviceRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import medicalRecordRoutes from './routes/medicalRecordRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.send('Health Check: Server is running!');
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
