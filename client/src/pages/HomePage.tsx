import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { CheckCircleFilled, CalendarOutlined, ArrowRightOutlined } from '@ant-design/icons';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* CỘT TRÁI: TEXT & CTA */}
            <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-bold tracking-wider mb-6">
                ✨ PHÒNG KHÁM CHUẨN Y KHOA
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Chăm sóc làn da <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Kiến tạo sự tự tin
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Đội ngũ bác sĩ da liễu hàng đầu với phác đồ điều trị cá nhân hóa.
                Cam kết an toàn, hiệu quả và công nghệ tiên tiến nhất hiện nay.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/booking">
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    className="h-14 px-8 text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
                  >
                    Đặt lịch khám ngay
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    size="large"
                    className="h-14 px-8 text-lg font-semibold rounded-xl border-gray-300 hover:border-blue-500 hover:text-blue-600"
                  >
                    Xem dịch vụ <ArrowRightOutlined className="ml-2"/>
                  </Button>
                </Link>
              </div>

              {/* Trust indicators (Các dòng cam kết nhỏ) */}
              <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircleFilled className="text-green-500 text-xl" /> Bác sĩ CKII
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleFilled className="text-green-500 text-xl" /> Máy móc nhập khẩu
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleFilled className="text-green-500 text-xl" /> Hỗ trợ 24/7
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: ẢNH MINH HỌA */}
            <div className="w-full lg:w-1/2 relative">
              {/* Hiệu ứng nền mờ (Blob effect) */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                <img
                  src="https://img.freepik.com/free-photo/dermatologist-examining-patient-s-skin_23-2148967045.jpg"
                  alt="Phong Clinic Doctor"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Card (Thẻ nổi giả lập số liệu) */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 animate-bounce-slow hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                      98%
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Khách hàng hài lòng</p>
                      <p className="font-bold text-gray-800">5,000+ Ca điều trị</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
