import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Lấy hàm login từ Context

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // Gọi API Backend
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email: values.email,
        password: values.password
      });

      message.success('Đăng nhập thành công! 🎉');

      // Lưu vào Context (Frontend tự động chuyển trang nhờ logic trong AuthContext)
      login(res.data.user, res.data.token);

    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-6">
        <div className="text-center mb-8">
          <span className="text-4xl">🏥</span>
          <Title level={2} className="mt-2 text-blue-600">PHONG CLINIC</Title>
          <p className="text-gray-500">Đăng nhập để tiếp tục</p>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="bg-blue-600 h-12 font-bold">
              ĐĂNG NHẬP
            </Button>
          </Form.Item>

          <div className="text-center">
            Chưa có tài khoản? <Link to="/register" className="text-blue-500 font-bold">Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
