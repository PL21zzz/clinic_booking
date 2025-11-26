// server/src/controllers/prescriptionController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

// 1. Lấy danh sách thuốc (cho bác sĩ chọn)
export const getMedicines = async (req: Request, res: Response) => {
  try {
    // Chỉ lấy thuốc còn tồn kho > 0
    const result = await pool.query('SELECT * FROM medicines WHERE stock_quantity > 0 ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách thuốc' });
  }
};

// 2. Tạo đơn thuốc & Trừ tồn kho (Transaction phức tạp)
export const createPrescription = async (req: Request, res: Response) => {
  const { appointment_id, medicines } = req.body;
  // medicines là mảng: [{ medicine_id: 1, quantity: 10, dosage: 'Sáng 1, Tối 1' }, ...]

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Bắt đầu giao dịch

    // Duyệt qua từng thuốc được kê
    for (const item of medicines) {
      // 2a. Insert vào bảng prescriptions
      const insertQuery = `
        INSERT INTO prescriptions (appointment_id, medicine_id, quantity, dosage, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `;
      await client.query(insertQuery, [appointment_id, item.medicine_id, item.quantity, item.dosage]);

      // 2b. Trừ tồn kho trong bảng medicines
      const updateStockQuery = `
        UPDATE medicines
        SET stock_quantity = stock_quantity - $1
        WHERE id = $2
      `;
      await client.query(updateStockQuery, [item.quantity, item.medicine_id]);
    }

    await client.query('COMMIT'); // Lưu tất cả
    res.status(201).json({ success: true, message: 'Đã kê đơn và trừ kho thành công!' });

  } catch (error) {
    await client.query('ROLLBACK'); // Lỗi thì hoàn tác hết
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi khi kê đơn thuốc' });
  } finally {
    client.release();
  }
};

// Thêm vào cuối file prescriptionController.ts

export const getPrescriptionByAppointment = async (req: Request, res: Response) => {
  const { appointment_id } = req.params; // Lấy ID từ URL

  try {
    // Join bảng prescriptions với medicines để lấy tên thuốc, đơn vị, giá
    const query = `
      SELECT
        p.id,
        p.quantity,
        p.dosage,
        m.name as medicine_name,
        m.unit,
        m.price
      FROM prescriptions p
      JOIN medicines m ON p.medicine_id = m.id
      WHERE p.appointment_id = $1
    `;

    const result = await pool.query(query, [appointment_id]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi lấy đơn thuốc' });
  }
};
