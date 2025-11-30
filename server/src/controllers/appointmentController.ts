import { Request, Response } from 'express';
// Import 2 Model vừa tạo
import Appointment from '../models/Appointment';
import Service from '../models/Service';

// 1. ĐẶT LỊCH
export const bookAppointment = async (req: Request, res: Response) => {
  const { patient_id, doctor_id, service_id, appointment_date, start_time } = req.body;

  try {
    // Bước A: Gọi Model Service để lấy thời lượng
    const serviceData = await Service.getDurationById(service_id);

    if (!serviceData) {
      return res.status(404).json({ success: false, message: 'Dịch vụ không tồn tại' });
    }

    const duration = serviceData.duration_minutes;

    // Bước B: Tính toán giờ kết thúc (Logic JS giữ nguyên)
    const [hour, minute] = start_time.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(hour, minute + duration);
    const end_time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    console.log(`Checking booking: ${start_time} - ${end_time}`);

    // Bước C: Gọi Model Appointment để kiểm tra trùng
    const isConflict = await Appointment.checkConflict(doctor_id, appointment_date, start_time, end_time);

    if (isConflict) {
      return res.status(409).json({
        success: false,
        message: 'Bác sĩ đã bận trong khung giờ này! Vui lòng chọn giờ khác.',
      });
    }

    // Bước D: Gọi Model Appointment để lưu vào DB
    const newAppointment = await Appointment.create({
      patient_id, doctor_id, service_id, appointment_date, start_time, end_time
    });

    return res.status(201).json({
      success: true,
      message: 'Đặt lịch thành công!',
      data: newAppointment,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi Server khi đặt lịch' });
  }
};

// 2. LẤY TẤT CẢ (ADMIN)
export const getAppointments = async (req: Request, res: Response) => {
  try {
    // Gọi Model lấy hết danh sách
    const data = await Appointment.findAll();

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách' });
  }
};

// 3. LẤY THEO USER (MY APPOINTMENTS)
export const getMyAppointments = async (req: any, res: Response) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // Gọi Model, truyền ID và Role vào để nó tự lọc
    const data = await Appointment.findByUser(userId, userRole);

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
