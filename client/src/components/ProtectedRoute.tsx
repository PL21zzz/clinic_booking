import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // Mảng các vai trò được phép vào (VD: ['doctor', 'admin'])
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth(); // Bạn nhớ thêm state loading vào AuthContext nhé (xem ghi chú dưới)

  // 1. Đang tải thông tin user -> Hiện xoay xoay
  if (loading) return <div className="h-screen flex justify-center items-center"><Spin size="large" /></div>;

  // 2. Chưa đăng nhập -> Đá về Login
  if (!user) {



    return <Navigate to="/login" replace />;
  }

  // 3. Đã đăng nhập nhưng không đủ quyền -> Đá về Trang chủ (hoặc trang 403)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Bệnh nhân cố vào trang Bác sĩ sẽ bị đẩy về Home
  }

  // 4. Hợp lệ -> Cho vào
  return <>{children}</>;
};

export default ProtectedRoute;
