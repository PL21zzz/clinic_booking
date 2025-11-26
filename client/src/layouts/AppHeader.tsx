// client/src/components/layout/AppHeader.tsx
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, MedicineBoxOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation();

  // Cấu hình menu items
  const items = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">Trang chủ</Link> },
    { key: '/services', icon: <MedicineBoxOutlined />, label: <Link to="/services">Dịch vụ</Link> },
    { key: '/my-records', icon: <UserOutlined />, label: <Link to="/my-records">Hồ sơ của tôi</Link> },
  ];

  return (
    <Header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-4 md:px-8 flex items-center justify-between h-20">

      {/* LOGO AREA */}
      <Link to="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-blue-300 shadow-lg group-hover:scale-110 transition-transform">
          🏥
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
            PHONG CLINIC
          </span>
          <span className="text-xs text-gray-500 font-medium tracking-widest">DERMATOLOGY</span>
        </div>
      </Link>

      {/* MENU AREA (Desktop) */}
      <div className="hidden md:flex flex-1 justify-center">
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          items={items}
          className="border-none bg-transparent min-w-[300px] justify-center text-base font-medium"
        />
      </div>

      {/* ACTION BUTTON (Ví dụ nút Đặt lịch nổi bật) */}
      <div className="hidden md:block">
        <Link to="/booking">
          <Button
            type="primary"
            shape="round"
            icon={<CalendarOutlined />}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 border-none font-semibold"
          >
            Đặt lịch ngay
          </Button>
        </Link>
      </div>
    </Header>
  );
};

export default AppHeader;
