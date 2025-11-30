// server/src/models/Prescription.ts
import pool from '../config/db';

const Prescription = {
    // 1. Lấy danh sách thuốc còn hàng
    getAvailableMedicines: async () => {
        const query = 'SELECT * FROM medicines WHERE stock_quantity > 0 ORDER BY name ASC';
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Tạo đơn thuốc & Trừ kho (Transaction)
    create: async (appointmentId: number, medicines: any[]) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            for (const item of medicines) {
                // 2a. Thêm vào bảng prescriptions
                const insertQuery = `
          INSERT INTO prescriptions (appointment_id, medicine_id, quantity, dosage, created_at)
          VALUES ($1, $2, $3, $4, NOW())
        `;
                await client.query(insertQuery, [appointmentId, item.medicine_id, item.quantity, item.dosage]);

                // 2b. Trừ tồn kho
                const updateStockQuery = `
          UPDATE medicines
          SET stock_quantity = stock_quantity - $1
          WHERE id = $2
        `;
                await client.query(updateStockQuery, [item.quantity, item.medicine_id]);
            }

            await client.query('COMMIT');
            return true; // Thành công

        } catch (error) {
            await client.query('ROLLBACK');
            throw error; // Ném lỗi ra để Controller bắt
        } finally {
            client.release();
        }
    },

    // 3. Lấy chi tiết đơn thuốc theo ID lịch hẹn
    getByAppointmentId: async (appointmentId: number) => {
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
        const result = await pool.query(query, [appointmentId]);
        return result.rows;
    }
};

export default Prescription;
