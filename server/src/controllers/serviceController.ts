import { Request, Response } from 'express';
import pool from '../config/db';

// 1. Lấy danh sách tất cả dịch vụ
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id ASC');

    res.status(200).json({
      success: true,
      data: result.rows, // Trả về mảng dịch vụ
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi Server' });
  }
};

// 2. Thêm dịch vụ mới (Làm luôn cho đủ bộ)
export const createService = async (req: Request, res: Response) => {
  const { name, price, duration_minutes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO services (name, price, duration_minutes) VALUES ($1, $2, $3) RETURNING *',
      [name, price, duration_minutes]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi thêm dịch vụ' });
  }
};
