import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Kích hoạt biến môi trường
dotenv.config();

const app = express();
const port = 3000;

// Cấu hình kết nối Database (Có Type checking đàng hoàng)
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'clinic_booking',
  password: process.env.POSTGRES_PASSWORD || '147204',
  port: 5432,
});

// Định nghĩa kiểu dữ liệu trả về (Interface) - Cái này JS không có nè
interface DbResult {
  now: string;
}

app.get('/', async (req: Request, res: Response) => {
  try {
    // Query thử thời gian từ DB
    const result = await pool.query('SELECT NOW()');

    // Ép kiểu kết quả trả về cho an toàn
    const data = result.rows[0] as DbResult;

    res.json({
      message: "🚀 Kết nối Database thành công với TypeScript!",
      timestamp: data.now,
      tech_stack: "Node.js + Express + TypeScript + PostgreSQL + Docker"
    });
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    res.status(500).json({ error: "Không thể kết nối tới Database" });
  }
});

app.listen(port, () => {
  console.log(`⚡️ Server đang chạy tại: http://localhost:${port}`);
});
