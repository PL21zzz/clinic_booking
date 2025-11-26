// server/src/controllers/invoiceController.ts
import { Request, Response } from 'express';
import pool from '../config/db';

// 1. Lấy thông tin thanh toán (Preview trước khi trả tiền)
export const getInvoicePreview = async (req: Request, res: Response) => {
  const { appointment_id } = req.params;

  try {
    // A. Lấy tiền dịch vụ
    const serviceQuery = `
      SELECT s.name, s.price
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.id = $1
    `;
    const serviceResult = await pool.query(serviceQuery, [appointment_id]);
    const service = serviceResult.rows[0];

    // B. Lấy tiền thuốc (Tính tổng: số lượng * đơn giá)
    const medicineQuery = `
      SELECT m.name, p.quantity, m.price, (p.quantity * m.price) as total
      FROM prescriptions p
      JOIN medicines m ON p.medicine_id = m.id
      WHERE p.appointment_id = $1
    `;
    const medicineResult = await pool.query(medicineQuery, [appointment_id]);

    // C. Tổng cộng
    const serviceFee = parseFloat(service?.price || 0);
    const medicineFee = medicineResult.rows.reduce((acc, item) => acc + parseFloat(item.total), 0);
    const totalAmount = serviceFee + medicineFee;

    res.json({
      success: true,
      data: {
        service_fee: { name: service?.name, price: serviceFee },
        medicines: medicineResult.rows, // Chi tiết từng loại thuốc
        total_amount: totalAmount
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi tính toán viện phí' });
  }
};

/// server/src/controllers/invoiceController.ts

export const createInvoice = async (req: Request, res: Response) => {
  const { appointment_id, total_amount, payment_method } = req.body;

  // Lấy client để dùng Transaction (đảm bảo tạo hóa đơn xong mới update trạng thái)
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Bắt đầu

    // 1. Tạo hóa đơn (Code cũ)
    const insertQuery = `
      INSERT INTO invoices (appointment_id, total_amount, payment_method, status, created_at)
      VALUES ($1, $2, $3, 'paid', NOW())
      RETURNING *
    `;
    const result = await client.query(insertQuery, [appointment_id, total_amount, payment_method]);

    // 2. [THÊM MỚI] Cập nhật trạng thái lịch hẹn -> 'paid'
    // Để danh sách chờ thu ngân không hiện lại nữa
    const updateApptQuery = `UPDATE appointments SET status = 'paid' WHERE id = $1`;
    await client.query(updateApptQuery, [appointment_id]);

    await client.query('COMMIT'); // Lưu tất cả
    res.status(201).json({ success: true, message: 'Thanh toán thành công!', data: result.rows[0] });

  } catch (error) {
    await client.query('ROLLBACK'); // Lỗi thì hoàn tác
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi tạo hóa đơn' });
  } finally {
    client.release();
  }
};
