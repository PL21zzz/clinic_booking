import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader'; // Import Header vừa tạo
import AppFooter from './AppFooter'; // Import Footer vừa tạo

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen flex flex-col">
      {/* 1. HEADER */}
      <AppHeader />

      {/* 2. BODY CONTENT */}
      {/* flex-grow để nó đẩy Footer xuống đáy nếu nội dung ngắn */}
      <Content className="flex-grow bg-slate-50">
        {/* Container giúp nội dung không bị bè ra hết màn hình */}
        <div className="w-full">
           <Outlet />
        </div>
      </Content>

      {/* 3. FOOTER */}
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
