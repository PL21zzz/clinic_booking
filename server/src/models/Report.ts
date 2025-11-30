// server/src/models/Report.ts
import pool from '../config/db';

const Report = {
    // 1. Lấy số liệu tổng quan (Cards)
    getGeneralStats: async () => {
        // Chạy song song 3 câu lệnh cho nhanh
        const [patientRes, apptRes, revenueRes] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM users WHERE role = 'patient'"),
            pool.query("SELECT COUNT(*) FROM appointments WHERE appointment_date = CURRENT_DATE"),
            pool.query("SELECT SUM(total_amount) FROM invoices WHERE status = 'paid'")
        ]);

        return {
            totalPatients: parseInt(patientRes.rows[0].count),
            todayAppointments: parseInt(apptRes.rows[0].count),
            totalRevenue: parseFloat(revenueRes.rows[0].sum || 0)
        };
    },

    // 2. Lấy biểu đồ doanh thu 7 ngày (Line Chart)
    getRevenueChart: async () => {
        const query = `
      SELECT
        TO_CHAR(created_at, 'DD/MM') as date,
        SUM(total_amount) as total
      FROM invoices
      WHERE status = 'paid'
      AND created_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(created_at, 'DD/MM')
      ORDER BY min(created_at) ASC
    `;
        const result = await pool.query(query);
        return result.rows;
    },

    // 3. Lấy biểu đồ trạng thái (Pie Chart)
    getStatusChart: async () => {
        const query = `
      SELECT status, COUNT(*) as count
      FROM appointments
      GROUP BY status
    `;
        const result = await pool.query(query);
        return result.rows;
    },

    // 4. Thống kê số lượng khách khám 7 ngày qua
    getAppointmentChart: async () => {
        const query = `
      SELECT
        TO_CHAR(appointment_date, 'DD/MM') as date,
        COUNT(*) as count
      FROM appointments
      WHERE appointment_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY TO_CHAR(appointment_date, 'DD/MM')
      ORDER BY min(appointment_date) ASC
    `;
        const result = await pool.query(query);
        return result.rows;
    }
};

export default Report;
