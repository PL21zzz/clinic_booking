// client/src/pages/AdminPage.tsx (hoặc AdminDashboard.tsx của bạn)
import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, message, Button } from 'antd'; // <--- Thêm Button
import { PlayCircleOutlined } from '@ant-design/icons';   // <--- Thêm Icon
import { useNavigate } from 'react-router-dom';           // <--- Thêm cái này để chuyển trang
import axios from 'axios';
import dayjs from 'dayjs';
import type { Appointment } from '../types';

const AdminDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // <--- Khởi tạo hook

  const fetchAppointments = async () => {
    // ... (Code cũ giữ nguyên)
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/appointments');
      setAppointments(res.data.data);
    } catch (error) {
      message.error('Lỗi tải lịch hẹn!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const columns = [
    // ... (Các cột cũ giữ nguyên: ID, Bệnh nhân, Dịch vụ...)
    { title: 'ID', dataIndex: 'id', width: 50 },
    { title: 'Bệnh nhân', dataIndex: 'patient_name', render: (t: string) => <b>{t}</b> },
    { title: 'Dịch vụ', dataIndex: 'service_name' },
    { title: 'Ngày khám', dataIndex: 'appointment_date', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    {
      title: 'Giờ',
      render: (_: any, record: Appointment) => (
        <Tag color="geekblue">{record.start_time.slice(0,5)} - {record.end_time.slice(0,5)}</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'pending') color = '#bdb822ff';
        if (status === 'completed') color = 'rgba(64, 181, 84, 0.8)'
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    // ---> THÊM CỘT NÀY <---
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Appointment) => (
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          disabled={record.status === 'completed'} // Nếu khám rồi thì ẩn nút đi
          onClick={() => {
            // Chuyển trang và mang theo cục data (record) của bệnh nhân này
            navigate('/admin/checkup', { state: { appointment: record } });
          }}
        >
          Khám
        </Button>
      )
    }
  ];

  return (
    <Card title="👨‍⚕️ Dashboard Bác sĩ - Quản lý Lịch hẹn" style={{ marginTop: 20 }}>
      <Table
        dataSource={appointments}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default AdminDashboard;
