import { Request, Response } from 'express';
import pool from '../config/db';

export const bookAppointment = async (req: Request, res: Response) => {
  // Lấy dữ liệu từ Frontend gửi lên
  const { patient_id, doctor_id, service_id, appointment_date, start_time } = req.body;

  try {
    // 1. Lấy thông tin dịch vụ để biết thời lượng (duration)
    const serviceResult = await pool.query('SELECT duration_minutes FROM services WHERE id = $1', [service_id]);

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Dịch vụ không tồn tại' });
    }

    const duration = serviceResult.rows[0].duration_minutes;

    // 2. Tính giờ kết thúc (End Time)
    // Logic: Start Time (String) + Duration (Phút) -> End Time (String)
    // Ví dụ: "09:00" + 60p = "10:00"
    // (Ở đây ta dùng xử lý chuỗi đơn giản cho demo, thực tế nên dùng thư viện momentjs hoặc date-fns)
    const [hour, minute] = start_time.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(hour, minute + duration); // Cộng thêm phút
    const end_time = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    console.log(`Checking booking: ${start_time} - ${end_time} on ${appointment_date}`);

    // 3. KIỂM TRA TRÙNG LỊCH (QUAN TRỌNG NHẤT)
    // Logic SQL: Tìm xem có lịch nào của bác sĩ đó, ngày đó mà thời gian bị chồng lấn không
    const conflictQuery = `
      SELECT * FROM appointments
      WHERE doctor_id = $1
      AND appointment_date = $2
      AND status != 'cancelled'
      AND (
        (start_time < $4 AND end_time > $3) -- Logic chồng lấn thời gian
      )
    `;

    const conflictResult = await pool.query(conflictQuery, [doctor_id, appointment_date, start_time, end_time]);

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Bác sĩ đã bận trong khung giờ này! Vui lòng chọn giờ khác.'
      });
    }

    // 4. Nếu không trùng -> Thêm vào Database
    const insertQuery = `
      INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `;

    const newAppointment = await pool.query(insertQuery, [
      patient_id, doctor_id, service_id, appointment_date, start_time, end_time
    ]);

    return res.status(201).json({
      success: true,
      message: 'Đặt lịch thành công!',
      data: newAppointment.rows[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Lỗi Server khi đặt lịch' });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        a.id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        u.full_name as patient_name,
        u.id as patient_id, -- Lấy thêm ID để dùng cho nút Khám
        s.name as service_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date DESC, a.start_time ASC
    `;
    // Query này KHÔNG có WHERE doctor_id, để Admin thấy hết

    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách' });
  }
};

// API CHO BỆNH NHÂN/BÁC SĨ (Xem của chính mình)
export const getMyAppointments = async (req: any, res: Response) => {
  // Lấy ID và Role từ Token (do middleware verifyToken gán vào req.user)
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let query = `
      SELECT a.*, u.full_name as patient_name, s.name as service_name, d.full_name as doctor_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN services s ON a.service_id = s.id
      JOIN users d ON a.doctor_id = d.id
    `;

    const params = [userId];

    // Nếu là Bệnh nhân -> Chỉ lấy lịch có patient_id = userId
    if (userRole === 'patient') {
      query += ` WHERE a.patient_id = $1`;
    }
    // Nếu là Bác sĩ -> Chỉ lấy lịch có doctor_id = userId
    else if (userRole === 'doctor') {
      query += ` WHERE a.doctor_id = $1`;
    }

    query += ` ORDER BY a.appointment_date DESC`;

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
