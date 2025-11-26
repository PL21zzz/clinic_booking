// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Key bí mật để ký tên vào Token (Thực tế nên để trong file .env)
const JWT_SECRET = process.env.JWT_SECRET || 'phong-clinic-secret-key-2025';

// 1. ĐĂNG KÝ (Register)
export const register = async (req: Request, res: Response) => {
  const { full_name, email, password, role } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    // Mã hóa mật khẩu (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Lưu vào DB
    // Lưu ý: role mặc định là 'patient' nếu không truyền lên
    const insertQuery = `
      INSERT INTO users (full_name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role
    `;
    const newUser = await pool.query(insertQuery, [full_name, email, hashedPassword, role || 'patient']);

    res.status(201).json({ success: true, message: 'Đăng ký thành công!', user: newUser.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 2. ĐĂNG NHẬP (Login)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Tìm user theo email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng!' });
    }

    const user = result.rows[0];

    // So sánh mật khẩu (Pass nhập vào vs Pass đã mã hóa trong DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng!' });
    }

    // Tạo Token (Cấp vé)
    // Trong vé này chứa ID và Role của user
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
