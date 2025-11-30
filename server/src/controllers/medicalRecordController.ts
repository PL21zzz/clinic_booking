// server/src/controllers/medicalRecordController.ts
import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord'; // <--- Import Model

// 1. Tạo hồ sơ bệnh án
export const createMedicalRecord = async (req: Request, res: Response) => {
  // Lấy dữ liệu từ Frontend
  const { appointment_id, diagnosis, symptoms, treatment_plan, notes } = req.body;

  try {
    // Gọi Model xử lý toàn bộ logic lưu trữ
    const newRecord = await MedicalRecord.create({
      appointment_id, diagnosis, symptoms, treatment_plan, notes
    });

    res.status(201).json({
      success: true,
      message: 'Đã lưu bệnh án thành công!',
      data: newRecord
    });

  } catch (error) {
    console.error("Lỗi lưu bệnh án:", error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lưu bệnh án' });
  }
};

// 2. Lấy lịch sử khám
export const getPatientHistory = async (req: Request, res: Response) => {
  const { patient_id } = req.query;

  try {
    // Gọi Model lấy danh sách
    const history = await MedicalRecord.findByPatientId(Number(patient_id));

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error("Lỗi lấy lịch sử:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
