import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'phong-clinic-secret-key-2025';

// Mở rộng kiểu Request để TS không báo lỗi
interface AuthRequest extends Request {
  user?: any;
}

// 1. Hàm xác thực: Kiểm tra xem có Token không? Token đúng không?
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header "Bearer <token>"

  if (!token) return res.status(401).json({ success: false, message: 'Không có quyền truy cập!' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Lưu thông tin user vào request để dùng sau
    next(); // Cho đi tiếp
  } catch (err) {
    res.status(400).json({ success: false, message: 'Token không hợp lệ!' });
  }
};

// 2. Hàm phân quyền: Kiểm tra Role
export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện chức năng này!' });
    }
    next();
  };
};
