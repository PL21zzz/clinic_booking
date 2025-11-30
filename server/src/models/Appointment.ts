import pool from '../config/db';

const Appointment = {
    // 1. Kiểm tra trùng lịch
    checkConflict: async (doctor_id: number, appointment_date: string, start_time: string, end_time: string) => {
        const query = `
      SELECT * FROM appointments
      WHERE doctor_id = $1
      AND appointment_date = $2
      AND status != 'cancelled'
      AND (
        (start_time < $4 AND end_time > $3) -- Logic chồng lấn thời gian
      )
    `;
        const result = await pool.query(query, [doctor_id, appointment_date, start_time, end_time]);
        return result.rows.length > 0; // Trả về true nếu trùng, false nếu không
    },

    // 2. Tạo lịch hẹn mới
    create: async (data: any) => {
        const { patient_id, doctor_id, service_id, appointment_date, start_time, end_time } = data;
        const query = `
      INSERT INTO appointments (patient_id, doctor_id, service_id, appointment_date, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `;
        const result = await pool.query(query, [patient_id, doctor_id, service_id, appointment_date, start_time, end_time]);
        return result.rows[0];
    },

    // 3. Lấy tất cả (Cho Admin)
    findAll: async () => {
        const query = `
      SELECT
        a.id, a.appointment_date, a.start_time, a.end_time, a.status,
        u.full_name as patient_name, u.id as patient_id,
        s.name as service_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date DESC, a.start_time ASC
    `;
        const result = await pool.query(query);
        return result.rows;
    },

    // 4. Lấy theo User (Bệnh nhân/Bác sĩ)
    findByUser: async (userId: number, role: string) => {
        let query = `
      SELECT a.*, u.full_name as patient_name, s.name as service_name, d.full_name as doctor_name
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN services s ON a.service_id = s.id
      JOIN users d ON a.doctor_id = d.id
    `;

        // Nối chuỗi SQL tùy theo role
        if (role === 'patient') {
            query += ` WHERE a.patient_id = $1`;
        } else if (role === 'doctor') {
            query += ` WHERE a.doctor_id = $1`;
        }

        query += ` ORDER BY a.appointment_date DESC`;

        const result = await pool.query(query, [userId]);
        return result.rows;
    }
};

export default Appointment;
