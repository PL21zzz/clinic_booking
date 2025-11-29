import React, { useEffect, useState } from 'react';
import { Card, Button, Steps, Alert, Divider } from 'antd';
import {
  CalendarOutlined,
  SolutionOutlined,
  SmileOutlined,
  PhoneFilled,
  ClockCircleFilled,
  InfoCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import type { Service } from '../types';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

const BookingPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Gọi API lấy danh sách dịch vụ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/services');
        setServices(res.data.data);
      } catch (error) {
        console.error('Lỗi tải dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Đăng Ký Khám Bệnh Trực Tuyến
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Đặt lịch nhanh chóng, không cần chờ đợi. Vui lòng điền đầy đủ thông tin để chúng tôi phục vụ bạn tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- CỘT TRÁI (MAIN CONTENT) --- */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card 1: Quy trình */}
            <Card className="shadow-sm rounded-xl border border-gray-100" title={<span className="font-bold text-lg"><SolutionOutlined /> QUY TRÌNH ĐĂNG KÝ</span>}>
              <Steps
                current={1}
                items={[
                  { title: 'Đăng ký', description: 'Chọn chuyên khoa & giờ', icon: <SolutionOutlined /> },
                  { title: 'Xác nhận', description: 'Nhận lịch hẹn', icon: <CalendarOutlined /> },
                  { title: 'Đến khám', description: 'Gặp bác sĩ', icon: <SmileOutlined /> },
                ]}
                className="py-6"
              />
            </Card>

            {/* Card 2: Form Đặt lịch (CTA) */}
            <Card className="shadow-md rounded-xl border border-blue-100 bg-white text-center py-10">
              <div className="mb-8">
                <img
                  src="https://img.freepik.com/free-vector/appointment-booking-with-calendar_23-2148565773.jpg"
                  alt="Booking Illustration"
                  className="w-48 mx-auto mb-6 opacity-80"
                />
                <h3 className="text-2xl font-bold text-slate-700 mb-2">Bạn đã sẵn sàng?</h3>
                <p className="text-gray-500 mb-6">
                  {user
                    ? `Xin chào ${user.full_name}, hãy chọn lịch khám phù hợp với bạn.`
                    : "Đăng nhập để hệ thống tự động điền thông tin của bạn."}
                </p>

                <Button
                  type="primary"
                  size="large"
                  icon={<CalendarOutlined />}
                  className="bg-blue-600 h-14 px-10 text-lg rounded-full font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
                  onClick={() => setIsModalVisible(true)}
                >
                  ĐẶT LỊCH KHÁM NGAY
                </Button>
              </div>

              <Alert
                message="Lưu ý quan trọng"
                description="Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục tiếp đón tại Quầy Lễ Tân (Tầng 1). Mang theo CMND/CCCD và BHYT (nếu có)."
                type="warning"
                showIcon
                className="text-left bg-orange-50 border-orange-100 rounded-lg mx-4 md:mx-10"
              />
            </Card>

            {/* Card 3: Giấy tờ cần chuẩn bị (Thêm cho giống thật) */}
            <Card className="shadow-sm rounded-xl border border-gray-100" title={<span className="font-bold"><InfoCircleOutlined /> CẦN CHUẨN BỊ GÌ KHI ĐI KHÁM?</span>}>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><CheckCircleOutlined className="text-green-500 mt-1" /> Căn cước công dân / Hộ chiếu (Bản chính).</li>
                <li className="flex items-start gap-2"><CheckCircleOutlined className="text-green-500 mt-1" /> Thẻ Bảo hiểm y tế / Bảo hiểm tư nhân (Nếu có).</li>
                <li className="flex items-start gap-2"><CheckCircleOutlined className="text-green-500 mt-1" /> Các kết quả xét nghiệm, đơn thuốc cũ (Trong vòng 6 tháng).</li>
                <li className="flex items-start gap-2"><CheckCircleOutlined className="text-green-500 mt-1" /> Nhịn ăn sáng nếu cần xét nghiệm máu.</li>
              </ul>
            </Card>

          </div>

          {/* --- CỘT PHẢI (SIDEBAR) --- */}
          <div className="space-y-6">

            {/* Box Hỗ trợ */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <PhoneFilled /> HỖ TRỢ KHẨN CẤP
              </h3>
              <div className="mb-4">
                <p className="text-blue-200 text-sm mb-1">Hotline Cấp cứu (24/7)</p>
                <p className="text-3xl font-bold text-yellow-400">1900 1234</p>
              </div>
              <Divider className="bg-blue-400" />
              <div>
                <p className="text-blue-200 text-sm mb-1">Tổng đài CSKH</p>
                <p className="text-xl font-bold">(028) 38 38 38 38</p>
              </div>
            </div>

            {/* Box Giờ làm việc */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <ClockCircleFilled className="text-blue-600" /> GIỜ LÀM VIỆC
              </h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between border-b border-dashed pb-2">
                  <span>Thứ 2 - Thứ 6</span>
                  <span className="font-semibold text-blue-600">07:00 - 17:00</span>
                </div>
                <div className="flex justify-between border-b border-dashed pb-2">
                  <span>Thứ 7</span>
                  <span className="font-semibold text-blue-600">07:00 - 12:00</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Chủ nhật & Lễ</span>
                  <span>Nghỉ</span>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 p-3 rounded text-xs text-blue-800">
                * Cấp cứu hoạt động 24/7 kể cả ngày lễ và chủ nhật.
              </div>
            </div>

            {/* Box Bản đồ (Ảnh giả lập) */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/pass/GoogleMapTA.jpg"
                alt="Map"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="font-bold text-slate-800 mb-1">PHONG CLINIC</p>
                <p className="text-sm text-gray-500">123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</p>
                <a href="#" className="text-blue-600 text-sm font-semibold mt-2 block hover:underline">Chỉ đường trên Google Maps &rarr;</a>
              </div>
            </div>
          </div>
        </div>

        {/* --- MODAL ĐẶT LỊCH --- */}
        <BookingModal
          visible={isModalVisible}
          services={services}
          onCancel={() => setIsModalVisible(false)}
          onSuccess={() => {
            setIsModalVisible(false);
          }}
        />
      </div>
    </div>
  );
};

export default BookingPage;
