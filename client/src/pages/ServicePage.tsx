import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, message, Tag, Breadcrumb } from 'antd';
import axios from 'axios';
import type { Service } from '../types'; // Nhớ kiểm tra đường dẫn file types

const { Title } = Typography;

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  // Hàm gọi API lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/services');
      setServices(response.data.data);
    } catch (error) {
      message.error('Không thể tải danh sách dịch vụ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Cấu hình cột bảng
  const columns = [
    { title: 'Mã DV', dataIndex: 'id', key: 'id', width: 80, align: 'center' as const },
    {
      title: 'Tên Dịch vụ / Kỹ thuật',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <b style={{ fontSize: 16 }}>{text}</b>
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => (
        <span style={{ color: '#108ee9', fontWeight: 'bold', fontSize: 15 }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </span>
      )
    },
    {
      title: 'Thời gian thực hiện',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      width: 180,
      render: (minutes: number) => <Tag color="cyan">⏱ {minutes} phút</Tag>
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Danh mục kỹ thuật</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        <Title level={3}>📋 Bảng giá Dịch vụ & Kỹ thuật</Title>
        <Table
          dataSource={services}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }} // Phân trang 10 dòng
          bordered
        />
      </Card>
    </div>
  );
};

export default ServicePage;
