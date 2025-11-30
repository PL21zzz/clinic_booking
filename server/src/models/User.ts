// server/src/models/User.ts
import pool from '../config/db';

const User = {
    // 1. Tìm user bằng Email (Dùng cho cả Đăng nhập & Đăng ký)
    findByEmail: async (email: string) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0]; // Trả về user tìm thấy hoặc undefined
    },

    // 2. Tạo user mới
    create: async (fullName: string, email: string, passwordHash: string, role: string) => {
        const query = `
      INSERT INTO users (full_name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role
    `;
        const result = await pool.query(query, [fullName, email, passwordHash, role]);
        return result.rows[0];
    },

    // 3. Tìm theo ID (Sẽ dùng cho Middleware sau này)
    findById: async (id: number) => {
        const query = 'SELECT id, full_name, email, role FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

export default User;
