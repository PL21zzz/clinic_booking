import React from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd'; // Thêm Dropdown, Avatar
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined, MedicineBoxOutlined, CalendarOutlined,
  UserOutlined, DollarCircleOutlined, LogoutOutlined, DownOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext'; // <--- IMPORT AUTH

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // <--- Lấy user và hàm logout từ Context

  // Cấu hình menu items dựa trên ROLE
  const items = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link> },
    { key: '/services', icon: <MedicineBoxOutlined />, label: <Link to="/services">Dịch vụ</Link> },
  ];

  // Chỉ hiện Đặt lịch & Hồ sơ nếu là Bệnh nhân (hoặc chưa đăng nhập)
  if (!user || user.role === 'patient') {
    items.push({ key: '/booking', icon: <CalendarOutlined />, label: <Link to="/booking">Đặt lịch</Link> });
    items.push({ key: '/my-records', icon: <UserOutlined />, label: <Link to="/my-records">Hồ sơ của tôi</Link> });
  }

  // Chỉ hiện Admin nếu là Bác sĩ
  if (user?.role === 'doctor') {
    items.push({ key: '/admin', icon: <UserOutlined />, label: <Link to="/admin">Bác sĩ</Link> });
  }

  // Chỉ hiện Thu ngân nếu là Cashier
  if (user?.role === 'cashier') {
    items.push({ key: '/cashier', icon: <DollarCircleOutlined />, label: <Link to="/cashier">Thu ngân</Link> });
  }

  // Menu con khi bấm vào tên người dùng
  const userMenu = {
    items: [
      { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: logout }
    ]
  };

  return (
    <Header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-4 md:px-8 flex items-center justify-between h-20">

      {/* LOGO AREA */}
      <Link to="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-blue-300 shadow-lg">
          🏥
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-800 tracking-tight leading-none">PHONG CLINIC</span>
        </div>
      </Link>

      {/* MENU AREA */}
      <div className="hidden md:flex flex-1 justify-center">
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          className="border-none bg-transparent min-w-[300px] justify-center text-base font-medium"
        />
      </div>

      {/* USER ACTION AREA (SỬA CHỖ NÀY) */}
      <div className="hidden md:block">
        {user ? (
          // Nếu ĐÃ ĐĂNG NHẬP -> Hiện tên + Avatar
          <Dropdown menu={userMenu} placement="bottomRight">
            <Button type="text" className="flex items-center gap-2 h-10">
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <span className="font-semibold text-gray-700">{user.full_name}</span>
              <DownOutlined className="text-xs text-gray-400" />
            </Button>
          </Dropdown>
        ) : (
          // Nếu CHƯA ĐĂNG NHẬP -> Hiện nút Login
          <div className="flex gap-3">
             <Link to="/login">
               <Button type="default" shape="round" className="border-blue-600 text-blue-600 font-semibold">Đăng nhập</Button>
             </Link>
             <Link to="/register">
               <Button type="primary" shape="round" className="bg-blue-600 font-semibold">Đăng ký</Button>
             </Link>
          </div>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
