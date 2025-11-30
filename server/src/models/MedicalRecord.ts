// server/src/models/MedicalRecord.ts
import pool from '../config/db';

const MedicalRecord = {
    // 1. Tạo hồ sơ bệnh án mới (Có Transaction)
    create: async (data: any) => {
        const { appointment_id, diagnosis, symptoms, treatment_plan, notes } = data;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Logic gộp chuỗi (Format dữ liệu trước khi lưu)
            const fullDiagnosis = `Triệu chứng: ${symptoms}. Kết luận: ${diagnosis}`;
            const fullTreatment = `${treatment_plan}. Ghi chú: ${notes || ''}`;

            // Insert vào bảng medical_records
            const insertQuery = `
        INSERT INTO medical_records
        (appointment_id, diagnosis, treatment_plan, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;

            const recordResult = await client.query(insertQuery, [
                appointment_id,
                fullDiagnosis,
                fullTreatment
            ]);

            // Update trạng thái lịch hẹn -> completed
            const updateQuery = `UPDATE appointments SET status = 'completed' WHERE id = $1`;
            await client.query(updateQuery, [appointment_id]);

            await client.query('COMMIT');

            return recordResult.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            throw error; // Ném lỗi ra để Controller bắt
        } finally {
            client.release();
        }
    },

    // 2. Lấy lịch sử khám bệnh theo ID Bệnh nhân
    findByPatientId: async (patientId: number) => {
        const query = `
      SELECT
        mr.id,
        mr.diagnosis,
        mr.treatment_plan,
        mr.notes,
        mr.created_at,
        s.name as service_name,
        u.full_name as doctor_name,
        a.appointment_date,
        a.id as appointment_id
      FROM medical_records mr
      JOIN appointments a ON mr.appointment_id = a.id
      JOIN services s ON a.service_id = s.id
      JOIN users u ON a.doctor_id = u.id
      WHERE a.patient_id = $1
      ORDER BY mr.created_at DESC
    `;

        const result = await pool.query(query, [patientId]);
        return result.rows;
    }
};

export default MedicalRecord;
