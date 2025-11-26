import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, Row, Col, Steps, message, Alert } from 'antd';
import { CalendarOutlined, SolutionOutlined, SmileOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { Service } from '../types';
import BookingModal from '../components/BookingModal'; // Import Modal từ thư mục components

const { Title, Paragraph } = Typography;

const BookingPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Vẫn cần gọi API lấy dịch vụ để truyền vào Modal cho khách chọn
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/services');
        setServices(response.data.data);
      } catch (error) {
        message.error('Lỗi kết nối hệ thống!');
      }
    };
    fetchServices();
  }, []);

  return (
    <div style={{ padding: '20px 0' }}>
      <Row gutter={[24, 24]} justify="center">

        {/* Cột trái: Hướng dẫn quy trình */}
        <Col xs={24} md={16}>
          <Card title="Quy trình Đăng ký Khám bệnh" style={{ borderRadius: 8 }}>
            <Steps
              current={1}
              items={[
                { title: 'Đăng ký', description: 'Chọn chuyên khoa & giờ khám', icon: <SolutionOutlined /> },
                { title: 'Xác nhận', description: 'Nhận lịch hẹn qua Email', icon: <CalendarOutlined /> },
                { title: 'Đến khám', description: 'Gặp bác sĩ theo lịch hẹn', icon: <SmileOutlined /> },
              ]}
              style={{ marginBottom: 40, marginTop: 20 }}
            />

            <Alert
              message="Lưu ý quan trọng"
              description="Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục tiếp đón. Nếu đến muộn quá 15 phút, lịch hẹn sẽ bị hủy."
              type="warning"
              showIcon
              style={{ marginBottom: 20 }}
            />

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Title level={4}>Bạn đã sẵn sàng đặt lịch?</Title>
              <Button
                type="primary"
                size="large"
                icon={<CalendarOutlined />}
                style={{ height: 50, fontSize: 18, padding: '0 40px' }}
                onClick={() => setIsModalVisible(true)} // Mở Modal
              >
                ĐẶT LỊCH KHÁM NGAY
              </Button>
            </div>
          </Card>
        </Col>

        {/* Cột phải: Thông tin phụ */}
        <Col xs={24} md={8}>
          <Card title="📞 Hỗ trợ khẩn cấp" style={{ marginBottom: 20, borderRadius: 8 }}>
            <Paragraph>
              Hotline Cấp cứu: <b style={{ color: 'red', fontSize: 18 }}>1900 1234</b>
            </Paragraph>
            <Paragraph>
              CSKH: <b>(028) 38 38 38 38</b>
            </Paragraph>
          </Card>

          <Card title="Giờ làm việc" style={{ borderRadius: 8 }}>
            <Paragraph><b>Thứ 2 - Thứ 6:</b> 07:00 - 17:00</Paragraph>
            <Paragraph><b>Thứ 7:</b> 07:00 - 12:00</Paragraph>
            <Paragraph><b>Chủ nhật:</b> Nghỉ</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Cái Modal đặt lịch (ẩn đi, khi bấm nút mới hiện) */}
      <BookingModal
        visible={isModalVisible}
        services={services}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          // Có thể thêm logic điều hướng sang trang "Cảm ơn" nếu muốn
        }}
      />
    </div>
  );
};

export default BookingPage;
