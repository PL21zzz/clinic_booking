// client/src/pages/DoctorCheckupPage.tsx
import React, { useState } from 'react';
import { Card, Form, Input, Button, Descriptions, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const DoctorCheckupPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy thông tin lịch hẹn được truyền từ trang Dashboard sang
  const appointment = location.state?.appointment;

  const [loading, setLoading] = useState(false);

  // Nếu người dùng vào thẳng link mà không qua dashboard -> không có dữ liệu
  if (!appointment) return <div style={{padding: 20}}>Không tìm thấy thông tin bệnh nhân!</div>;

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // Gọi API Backend (cái mà bạn đã setup medicalRecordController)
      await axios.post('http://localhost:3000/api/medical-records', {
        appointment_id: appointment.id,
        patient_id: 1, // Tạm thời hardcode hoặc lấy từ appointment.patient_id nếu query có join
        doctor_id: 2,  // Tạm thời hardcode ID bác sĩ (sau này lấy từ login)
        diagnosis: values.diagnosis,
        symptoms: values.symptoms,
        treatment_plan: values.treatment_plan,
        notes: values.notes
      });

      message.success('Đã lưu bệnh án thành công!');
      navigate('/admin'); // Quay về dashboard
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi lưu bệnh án!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <Card title={`🩺 Phiếu Khám Bệnh: ${appointment.patient_name}`}>
        {/* Thông tin bệnh nhân (Read-only) */}
        <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
          <Descriptions.Item label="Dịch vụ">{appointment.service_name}</Descriptions.Item>
          <Descriptions.Item label="Ngày khám">{dayjs(appointment.appointment_date).format('DD/MM/YYYY')}</Descriptions.Item>
        </Descriptions>

        {/* Form nhập liệu */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Triệu chứng lâm sàng" name="symptoms" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Bệnh nhân kêu đau gì?..." />
          </Form.Item>

          <Form.Item label="Chẩn đoán (ICD-10)" name="diagnosis" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Viêm da cơ địa..." />
          </Form.Item>

          <Form.Item label="Phương hướng điều trị" name="treatment_plan" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Uống thuốc gì? Kiêng cữ gì?..." />
          </Form.Item>

          <Form.Item label="Ghi chú thêm" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            HOÀN TẤT KHÁM BỆNH
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default DoctorCheckupPage;
