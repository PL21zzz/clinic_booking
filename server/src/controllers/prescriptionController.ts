// server/src/controllers/prescriptionController.ts
import { Request, Response } from 'express';
import Prescription from '../models/Prescription'; // <--- Import Model

// 1. Lấy danh sách thuốc
export const getMedicines = async (req: Request, res: Response) => {
  try {
    const medicines = await Prescription.getAvailableMedicines();
    res.json({ success: true, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thuốc' });
  }
};

// 2. Tạo đơn thuốc
export const createPrescription = async (req: Request, res: Response) => {
  const { appointment_id, medicines } = req.body;

  try {
    // Gọi Model xử lý Transaction phức tạp
    await Prescription.create(appointment_id, medicines);

    res.status(201).json({ success: true, message: 'Đã kê đơn và trừ kho thành công!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi kê đơn thuốc' });
  }
};

// 3. Xem chi tiết đơn thuốc
export const getPrescriptionByAppointment = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;

  try {
    const prescriptionList = await Prescription.getByAppointmentId(Number(appointment_id));

    res.json({ success: true, data: prescriptionList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi lấy đơn thuốc' });
  }
};
