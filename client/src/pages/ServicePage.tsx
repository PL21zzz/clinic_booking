import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Input, Spin, Empty } from 'antd';
import {
  SearchOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  CalendarOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../types';
import axiosClient from '../api/axiosClient';

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // 1. Lấy dữ liệu từ API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/services');
      setServices(response.data.data);
      setFilteredServices(response.data.data);
    } catch (error) {
      console.error('Lỗi tải dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Xử lý tìm kiếm
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = services.filter(s =>
      s.name.toLowerCase().includes(value)
    );
    setFilteredServices(filtered);
  };

  // 3. Cấu hình cột cho bảng
  const columns = [
    {
      title: 'TÊN DỊCH VỤ / KỸ THUẬT',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <MedicineBoxOutlined />
          </div>
          <span className="font-semibold text-gray-800 text-base">{text}</span>
        </div>
      ),
    },
    {
      title: 'THỜI GIAN',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      width: 150,
      render: (minutes: number) => (
        <Tag icon={<ClockCircleOutlined />} color="cyan" className="px-3 py-1 rounded-full border-none text-sm">
          {minutes} phút
        </Tag>
      ),
    },
    {
      title: 'CHI PHÍ (VND)',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      align: 'right' as const,
      render: (price: number) => (
        <span className="text-blue-600 font-bold text-lg flex items-center justify-end gap-1">
          {new Intl.NumberFormat('vi-VN').format(price)} <span className="text-xs text-gray-400">đ</span>
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: () => (
        <Button
          type="primary"
          shape="round"
          icon={<CalendarOutlined />}
          className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
          onClick={() => navigate('/booking')}
        >
          Đặt lịch
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* --- HEADER BANNER --- */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 py-16 px-4 text-center relative overflow-hidden">
        {/* Họa tiết trang trí */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white opacity-10 rounded-full -mr-10 -mb-10 blur-3xl"></div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
          Danh Mục Dịch Vụ & Bảng Giá
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg relative z-10">
          Minh bạch chi phí - Cam kết không phát sinh. Bảng giá được niêm yết theo quy định của Bộ Y Tế.
        </p>
      </div>

      {/* --- SEARCH BAR (Nổi lên trên banner) --- */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-xl shadow-lg max-w-3xl mx-auto flex gap-2 items-center">
          <SearchOutlined className="text-gray-400 text-xl ml-2" />
          <Input
            placeholder="Tìm kiếm tên dịch vụ, kỹ thuật..."
            bordered={false}
            size="large"
            className="text-lg"
            onChange={handleSearch}
          />
          <Button type="primary" size="large" className="bg-blue-600 px-8 rounded-lg">
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 mt-12 max-w-5xl">

        {loading ? (
          <div className="text-center py-20"><Spin size="large" /></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredServices.length > 0 ? (
              <Table
                dataSource={filteredServices}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 8 }}
                scroll={{ x: 700 }} // Cho phép cuộn ngang trên điện thoại
                rowClassName="hover:bg-blue-50/50 transition-colors cursor-default"
              />
            ) : (
              <div className="p-10 text-center">
                <Empty description="Không tìm thấy dịch vụ nào phù hợp" />
              </div>
            )}
          </div>
        )}

        {/* --- INFO BOX (Thông tin thêm) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
            <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm"><DollarCircleOutlined style={{ fontSize: 20 }} /></div>
            <div>
              <h4 className="font-bold text-blue-800">Chi phí minh bạch</h4>
              <p className="text-sm text-blue-600/80 m-0">Cam kết đúng giá niêm yết, tư vấn kỹ trước khi thực hiện.</p>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-start gap-4">
            <div className="bg-white p-3 rounded-full text-green-600 shadow-sm"><MedicineBoxOutlined style={{ fontSize: 20 }} /></div>
            <div>
              <h4 className="font-bold text-green-800">Bảo hiểm y tế</h4>
              <p className="text-sm text-green-600/80 m-0">Hỗ trợ thanh toán BHYT và Bảo hiểm tư nhân.</p>
            </div>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex items-start gap-4">
            <div className="bg-white p-3 rounded-full text-purple-600 shadow-sm"><ClockCircleOutlined style={{ fontSize: 20 }} /></div>
            <div>
              <h4 className="font-bold text-purple-800">Đặt lịch 24/7</h4>
              <p className="text-sm text-purple-600/80 m-0">Chủ động thời gian, không cần chờ đợi lâu.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicePage;
