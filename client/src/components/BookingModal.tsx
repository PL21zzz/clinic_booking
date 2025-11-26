import React, { useState } from 'react';
import { Modal, Form, DatePicker, TimePicker, Select, message } from 'antd';
import axios from 'axios';
import type { Service } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface BookingModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  services: Service[]; // Truyền danh sách dịch vụ vào để chọn
}

const BookingModal: React.FC<BookingModalProps> = ({ visible, onCancel, onSuccess, services }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const handleOk = async () => {
    // Kiểm tra đăng nhập trước khi cho đặt
    if (!user) {
      message.warning('Vui lòng đăng nhập để đặt lịch!');
      // Có thể navigate('/login') ở đây
      return;
    }

    try {
      // 1. Validate form
      const values = await form.validateFields();
      setLoading(true);

      // 2. Chuẩn bị dữ liệu gửi lên Server
      // Lưu ý: patient_id mình đang để cứng là 1 (giả bộ đã đăng nhập)
      const payload = {
        patient_id: 1,
        doctor_id: values.doctor_id,
        service_id: values.service_id,
        appointment_date: values.appointment_date.format('YYYY-MM-DD'), // Format ngày chuẩn SQL
        start_time: values.start_time.format('HH:mm'), // Format giờ chuẩn SQL
      };

      // 3. Gọi API
      await axios.post('http://localhost:3000/api/appointments/book', payload);

      message.success('Đặt lịch thành công!');
      form.resetFields();
      onSuccess(); // Báo cho App biết để đóng modal
    } catch (error: any) {
      // Nếu Backend trả về lỗi 409 (Trùng lịch) thì báo đỏ
      if (error.response && error.response.status === 409) {
        message.error(error.response.data.message);
      } else {
        message.error('Lỗi khi đặt lịch!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="📅 Đặt lịch khám mới"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Xác nhận đặt"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        {/* Chọn Dịch vụ */}
        <Form.Item name="service_id" label="Chọn Dịch vụ" rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}>
          <Select placeholder="Bạn muốn khám gì?">
            {services.map(s => (
              <Select.Option key={s.id} value={s.id}>
                {s.name} - {s.duration_minutes} phút ({s.price.toLocaleString()}đ)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Chọn Bác sĩ (Giả bộ fix cứng data bác sĩ vì chưa làm API lấy bác sĩ) */}
        <Form.Item name="doctor_id" label="Chọn Bác sĩ" rules={[{ required: true, message: 'Vui lòng chọn bác sĩ!' }]}>
          <Select placeholder="Chọn bác sĩ phụ trách">
            <Select.Option value={2}>Bác sĩ Minh (Da liễu)</Select.Option>
          </Select>
        </Form.Item>

        {/* Chọn Ngày & Giờ (xếp ngang hàng) */}
        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="appointment_date" label="Ngày khám" rules={[{ required: true }]} style={{ flex: 1 }}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="start_time" label="Giờ bắt đầu" rules={[{ required: true }]} style={{ flex: 1 }}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={30} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default BookingModal;
