import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Spin, Table, Tag, Empty } from 'antd';
import {
  UserOutlined,
  DollarCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import {
  BarChart, Bar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import axiosClient from '../api/axiosClient';
import type { Appointment } from '../types';
import dayjs from 'dayjs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resStats = await axiosClient.get('/reports/dashboard');
      setStats(resStats.data.data);

      const resAppt = await axiosClient.get('/appointments/all');
      setRecentAppointments(resAppt.data.data.slice(0, 5));
    } catch (error) {
      console.error("Lỗi tải dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const getApptData = () => {
    if (!stats?.appointmentChart) return [];
    return stats.appointmentChart.map((item: any) => ({
      date: item.date,
      count: Number(item.count) // Ép kiểu số
    }));
  };

  // --- FIX LỖI: HÀM CHUYỂN ĐỔI DỮ LIỆU ---

  // 1. Chuyển String sang Number cho biểu đồ Doanh thu
  const getRevenueData = () => {
    if (!stats?.revenueChart) return [];
    return stats.revenueChart.map((item: any) => ({
      date: item.date,
      // Ép kiểu quan trọng: Number()
      total: Number(item.total)
    }));
  };

  // 2. Chuyển String sang Number cho biểu đồ Tròn
  const getStatusData = () => {
    if (!stats?.statusChart) return [];
    return stats.statusChart.map((item: any) => ({
      name: item.status.toUpperCase(),
      // Ép kiểu quan trọng: Number()
      value: Number(item.count)
    }));
  };

  if (loading) return <div className="flex h-screen justify-center items-center"><Spin size="large" /></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">📊 Tổng Quan Bệnh Viện</h2>

      {/* 1. CARDS THỐNG KÊ */}
      <Row gutter={16} className="mb-8">
        <Col span={8}>
          <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-all">
            <Statistic
              title="Doanh thu tổng"
              value={stats?.summary.totalRevenue}
              precision={0}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
              prefix={<DollarCircleOutlined />}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-all">
            <Statistic
              title="Bệnh nhân"
              value={stats?.summary.totalPatients}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm rounded-xl hover:shadow-md transition-all">
            <Statistic
              title="Lịch hẹn hôm nay"
              value={stats?.summary.todayAppointments}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 2. BIỂU ĐỒ (CHARTS) */}
      <Row gutter={24} className="mb-8">
        {/* Biểu đồ Doanh thu (Line) */}
        <Col xs={24} lg={16}>
          <Card title="📈 Biểu đồ Doanh thu (7 ngày)" bordered={false} className="shadow-sm rounded-xl">
            {/* FIX LỖI: Set chiều cao cứng cho div chứa biểu đồ */}
            <div style={{ width: '100%', height: 350 }}>
              {getRevenueData().length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={getRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis width={80} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value)) + ' đ'} />
                    <Line type="monotone" dataKey="total" stroke="#1890ff" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Chưa có dữ liệu doanh thu tuần này" className="mt-10" />
              )}
            </div>
          </Card>
        </Col>

        {/* Biểu đồ Trạng thái (Pie) */}
        <Col xs={24} lg={8}>
          <Card title="Tỉ lệ Trạng thái" bordered={false} className="shadow-sm rounded-xl">
            <div style={{ width: '100%', height: 350 }}>
              {getStatusData().length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={getStatusData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getStatusData().map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Chưa có dữ liệu lịch hẹn" className="mt-10" />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} className="mb-8">
        <Col span={24}>
          <Card title="📊 Số lượng khách đến khám (7 ngày)" bordered={false} className="shadow-sm rounded-xl">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={getApptData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} /> {/* Số người thì không có lẻ */}
                  <Tooltip />
                  <Bar dataKey="count" name="Số khách" fill="#8884d8" barSize={50} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. BẢNG HOẠT ĐỘNG GẦN ĐÂY */}
      <Card title="Lịch hẹn mới nhất" bordered={false} className="shadow-sm rounded-xl">
        <Table
          dataSource={recentAppointments}
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Bệnh nhân', dataIndex: 'patient_name', render: (t) => <b>{t}</b> },
            { title: 'Dịch vụ', dataIndex: 'service_name' },
            { title: 'Ngày khám', dataIndex: 'appointment_date', render: (d) => dayjs(d).format('DD/MM/YYYY') },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (status) => {
                let color = 'default';
                if (status === 'paid') color = 'success';
                if (status === 'pending') color = 'warning';
                if (status === 'completed') color = 'processing';
                if (status === 'confirmed') color = 'blue';
                return <Tag color={color}>{status?.toUpperCase()}</Tag>
              }
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
