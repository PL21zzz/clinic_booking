// server/src/models/Service.ts
import pool from '../config/db';

const Service = {
    // 1. Lấy tất cả dịch vụ (Dùng cho ServicePage)
    getAll: async () => {
        const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
        return result.rows;
    },

    // 2. Thêm dịch vụ mới (Dùng cho Admin nhập liệu)
    create: async (name: string, price: number, duration: number) => {
        const query = `
      INSERT INTO services (name, price, duration_minutes)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const result = await pool.query(query, [name, price, duration]);
        return result.rows[0];
    },

    // 3. Lấy thời lượng (Dùng cho AppointmentController tính giờ kết thúc)
    // (Giữ lại hàm này để không bị lỗi code đặt lịch nhé!)
    getDurationById: async (id: number) => {
        const query = 'SELECT duration_minutes FROM services WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

export default Service;
