// server/src/controllers/medicalRecordController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export const createMedicalRecord = async (req: Request, res: Response) => {
  // 1. Chỉ lấy những dữ liệu mà Database bảng medical_records cần
  const { appointment_id, diagnosis, symptoms, treatment_plan, notes } = req.body;

  // Lưu ý: diagnosis và treatment_plan là bắt buộc theo file init.sql của bạn

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 2. Insert vào bảng medical_records (SỬA LẠI QUERY NÀY)
    // Bỏ patient_id, doctor_id ra khỏi câu lệnh insert vì bảng không có cột đó
    const insertQuery = `
      INSERT INTO medical_records
      (appointment_id, diagnosis, treatment_plan, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;

    // Ở đây mình gộp chung symptoms + notes vào diagnosis hoặc treatment_plan
    // Vì bảng của bạn hơi ít cột. Hoặc bạn có thể nối chuỗi lại.
    // Ví dụ: Lưu Triệu chứng + Chẩn đoán vào cột diagnosis
    const fullDiagnosis = `Triệu chứng: ${symptoms}. Kết luận: ${diagnosis}`;
    const fullTreatment = `${treatment_plan}. Ghi chú: ${notes}`;

    const recordResult = await client.query(insertQuery, [
      appointment_id,
      fullDiagnosis,
      fullTreatment
    ]);

    // 3. Update trạng thái lịch hẹn thành "completed"
    const updateQuery = `UPDATE appointments SET status = 'completed' WHERE id = $1`;
    await client.query(updateQuery, [appointment_id]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Đã lưu bệnh án thành công!',
      data: recordResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Lỗi lưu bệnh án:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  } finally {
    client.release();
  }
};

export const getPatientHistory = async (req: Request, res: Response) => {
  const { patient_id } = req.query;

  try {
    const query = `
      SELECT
        mr.id,
        mr.diagnosis,
        mr.treatment_plan,
        mr.notes,
        mr.created_at,
        s.name as service_name,
        u.full_name as doctor_name,
        a.appointment_date,      -- Nhớ dấu phẩy ở đây
        a.id as appointment_id   -- Dòng mới thêm vào
      FROM medical_records mr
      JOIN appointments a ON mr.appointment_id = a.id
      JOIN services s ON a.service_id = s.id
      JOIN users u ON a.doctor_id = u.id
      WHERE a.patient_id = $1
      ORDER BY mr.created_at DESC
    `;

    const result = await pool.query(query, [patient_id]);

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Lỗi lấy lịch sử:", error); // Nó sẽ hiện lỗi chi tiết ở terminal server nếu có
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
