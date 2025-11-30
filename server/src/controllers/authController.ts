// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // <--- Import Model vừa tạo

const JWT_SECRET = process.env.JWT_SECRET || 'phong-clinic-secret-key-2025';

// 1. ĐĂNG KÝ
export const register = async (req: Request, res: Response) => {
  const { full_name, email, password, role } = req.body;

  try {
    // Bước A: Gọi Model để kiểm tra email
    const userExist = await User.findByEmail(email);
    if (userExist) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    // Bước B: Mã hóa mật khẩu (Logic này thuộc về Controller)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Bước C: Gọi Model để lưu vào DB
    // (Xử lý role mặc định là 'patient' ở đây trước khi gửi cho Model)
    const userRole = role || 'patient';
    const newUser = await User.create(full_name, email, hashedPassword, userRole);

    res.status(201).json({ success: true, message: 'Đăng ký thành công!', user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// 2. ĐĂNG NHẬP
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Bước A: Gọi Model tìm user
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng!' });
    }

    // Bước B: So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng!' });
    }

    // Bước C: Tạo Token
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
