// server/src/models/Invoice.ts
import pool from '../config/db';

const Invoice = {
    // 1. Lấy phí dịch vụ của cuộc hẹn
    getServiceFee: async (appointmentId: number) => {
        const query = `
      SELECT s.name, s.price
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.id = $1
    `;
        const result = await pool.query(query, [appointmentId]);
        return result.rows[0];
    },

    // 2. Lấy phí thuốc của cuộc hẹn
    getMedicineFee: async (appointmentId: number) => {
        const query = `
      SELECT m.name, p.quantity, m.price, (p.quantity * m.price) as total
      FROM prescriptions p
      JOIN medicines m ON p.medicine_id = m.id
      WHERE p.appointment_id = $1
    `;
        const result = await pool.query(query, [appointmentId]);
        return result.rows;
    },

    // 3. Tạo hóa đơn & Cập nhật trạng thái (Transaction)
    create: async (appointmentId: number, totalAmount: number, paymentMethod: string) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Tạo hóa đơn
            const insertQuery = `
        INSERT INTO invoices (appointment_id, total_amount, payment_method, status, created_at)
        VALUES ($1, $2, $3, 'paid', NOW())
        RETURNING *
      `;
            const result = await client.query(insertQuery, [appointmentId, totalAmount, paymentMethod]);

            // Cập nhật trạng thái lịch hẹn -> 'paid'
            const updateApptQuery = `UPDATE appointments SET status = 'paid' WHERE id = $1`;
            await client.query(updateApptQuery, [appointmentId]);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error; // Ném lỗi ra để Controller bắt
        } finally {
            client.release();
        }
    }
};

export default Invoice;
