// client/src/components/layout/AppFooter.tsx
import React from 'react';
import { Layout } from 'antd';
import { FacebookFilled, InstagramFilled, YoutubeFilled, PhoneFilled, MailFilled, EnvironmentFilled } from '@ant-design/icons';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="bg-slate-900 text-white pt-16 pb-8 px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* CỘT 1: GIỚI THIỆU */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">🏥</span>
              <span className="text-2xl font-bold text-blue-400">PHONG CLINIC</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Phòng khám da liễu hàng đầu với trang thiết bị hiện đại và đội ngũ bác sĩ chuyên môn cao.
              Chúng tôi cam kết mang lại vẻ đẹp tự tin và làn da khỏe mạnh cho bạn.
            </p>
            <div className="flex gap-4">
              <FacebookFilled className="text-2xl text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
              <InstagramFilled className="text-2xl text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <YoutubeFilled className="text-2xl text-gray-400 hover:text-red-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* CỘT 2: LIÊN KẾT NHANH */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2 inline-block">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/" className="hover:text-blue-400 transition-colors">Trang chủ</a></li>
              <li><a href="/services" className="hover:text-blue-400 transition-colors">Dịch vụ & Bảng giá</a></li>
              <li><a href="/booking" className="hover:text-blue-400 transition-colors">Đặt lịch khám</a></li>
              <li><a href="/admin" className="hover:text-blue-400 transition-colors">Dành cho Bác sĩ</a></li>
            </ul>
          </div>

          {/* CỘT 3: LIÊN HỆ */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-700 pb-2 inline-block">
              Thông Tin Liên Hệ
            </h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <EnvironmentFilled className="text-blue-500 mt-1" />
                <span>123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneFilled className="text-blue-500" />
                <span>Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center gap-3">
                <MailFilled className="text-blue-500" />
                <span>contact@phongclinic.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* BẢN QUYỀN */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Phong Dermatology Clinic. All rights reserved. Created by Phong Lang.</p>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
