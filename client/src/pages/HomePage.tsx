import React from 'react';
import { Button, Card, Avatar, Tag } from 'antd';
import { Link } from 'react-router-dom';
import {
  CalendarOutlined,
  ArrowRightOutlined,
  PhoneFilled,
  ClockCircleFilled,
  EnvironmentFilled,
  StarFilled,
  CheckCircleFilled
} from '@ant-design/icons';

const HomePage: React.FC = () => {

  // Dữ liệu giả lập cho Dịch vụ
  const services = [
    { title: "Khám Da Liễu", desc: "Điều trị mụn, nám, tàn nhang chuẩn y khoa.", icon: "🩺" },
    { title: "Thẩm Mỹ Da", desc: "Laser CO2, trẻ hóa da, tiêm Filler/Botox.", icon: "✨" },
    { title: "Điều Trị Sẹo", desc: "Phác đồ cá nhân hóa cho sẹo rỗ, sẹo lồi.", icon: "🔬" },
    { title: "Dị Ứng - Miễn Dịch", desc: "Xét nghiệm và điều trị viêm da cơ địa.", icon: "🛡️" },
  ];

  // Dữ liệu giả lập Bác sĩ
  const doctors = [
    { name: "BS.CKII Trần Minh", role: "Trưởng Khoa Da Liễu", img: "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg" },
    { name: "ThS.BS Nguyễn Lan", role: "Chuyên gia Thẩm mỹ", img: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg" },
    { name: "BS.CKI Phạm Phong", role: "Bác sĩ Điều trị", img: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg" },
  ];

  return (
    <div className="bg-white">

      {/* --- 1. HERO SECTION (BANNER) --- */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white pt-10 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 z-10 animate-fade-in-up">
            <Tag color="blue" className="mb-4 px-3 py-1 text-sm font-semibold rounded-full border-none bg-blue-100 text-blue-700">
              🏥 BỆNH VIỆN ĐA KHOA PHONG CLINIC
            </Tag>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Chăm sóc sức khỏe <br/>
              <span className="text-blue-600">Toàn diện & Tận tâm</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
              Hệ thống y tế chuẩn quốc tế với đội ngũ chuyên gia đầu ngành.
              Chúng tôi cam kết mang lại trải nghiệm khám chữa bệnh an toàn, hiệu quả và nhân văn nhất.
            </p>
            <div className="flex gap-4">
              <Link to="/booking">
                <Button type="primary" size="large" className="bg-blue-600 h-12 px-8 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
                  <CalendarOutlined /> Đặt Lịch Khám
                </Button>
              </Link>
              <Link to="/services">
                <Button size="large" className="h-12 px-8 rounded-xl font-semibold border-blue-200 text-blue-700 hover:border-blue-500 hover:text-blue-600">
                  Tìm Hiểu Thêm
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Content (Thay ảnh đại bàng bằng ảnh bác sĩ thật) */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-30"></div>
            <img
              src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg"
              alt="Medical Team"
              className="relative rounded-3xl shadow-2xl border-4 border-white object-cover w-full h-auto transform hover:-translate-y-2 transition-transform duration-500"
            />
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow max-w-xs border border-gray-100 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircleFilled style={{fontSize: 24}}/></div>
                <div>
                  <p className="text-sm text-gray-500 m-0">Đã phục vụ</p>
                  <p className="text-lg font-bold text-slate-800 m-0">15,000+ Bệnh nhân</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. INFO BAR (Đặc trưng của Web bệnh viện) --- */}
      <section className="bg-blue-600 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-blue-400/50">
            <div className="flex items-center gap-4 px-4 justify-center md:justify-start">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl"><ClockCircleFilled /></div>
              <div>
                <p className="opacity-80 text-sm m-0">Giờ làm việc</p>
                <p className="font-bold text-lg m-0">Thứ 2 - Thứ 7: 07:00 - 17:00</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 justify-center md:justify-start pt-4 md:pt-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl"><PhoneFilled /></div>
              <div>
                <p className="opacity-80 text-sm m-0">Hotline Cấp cứu</p>
                <p className="font-bold text-lg m-0 text-yellow-300">1900 1234 (24/7)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 justify-center md:justify-start pt-4 md:pt-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl"><EnvironmentFilled /></div>
              <div>
                <p className="opacity-80 text-sm m-0">Địa chỉ</p>
                <p className="font-bold text-lg m-0">Q.5, TP. Hồ Chí Minh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. DỊCH VỤ NỔI BẬT --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Chuyên Khoa & Dịch Vụ</h2>
          <p className="text-gray-500 mb-12">Các giải pháp chăm sóc sức khỏe toàn diện tại Phong Clinic</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((item, index) => (
              <Card key={index} hoverable className="border-none shadow-sm hover:shadow-xl transition-all rounded-2xl h-full">
                <div className="text-4xl mb-4 bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/services">
              <Button size="large" type="default" className="border-blue-600 text-blue-600 font-medium px-8 rounded-full hover:bg-blue-50">
                Xem tất cả dịch vụ <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- 4. ĐỘI NGŨ BÁC SĨ --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Đội Ngũ Chuyên Gia</h2>
              <p className="text-gray-500 max-w-lg">
                Các bác sĩ đầu ngành với nhiều năm kinh nghiệm tại các bệnh viện lớn, tận tâm vì sức khỏe của bạn.
              </p>
            </div>
            <Link to="/booking" className="hidden md:block">
              <Button type="link" className="text-blue-600 font-bold text-lg">Xem tất cả bác sĩ <ArrowRightOutlined/></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doc, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer">
                <img src={doc.img} alt={doc.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{doc.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{doc.role}</p>
                  <div className="flex gap-1 text-yellow-400">
                    <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. CALL TO ACTION --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">

            {/* Họa tiết trang trí nền */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
              Sẵn sàng chăm sóc sức khỏe cho bạn?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg relative z-10">
              Đừng để bệnh tật làm phiền cuộc sống. Đội ngũ Phong Clinic luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link to="/booking">
                <Button size="large" className="h-14 px-10 text-lg rounded-full font-bold border-none text-blue-700 bg-white hover:bg-gray-100 shadow-lg">
                  Đặt Lịch Ngay
                </Button>
              </Link>
              <Button size="large" ghost className="h-14 px-10 text-lg rounded-full font-bold border-white text-white hover:bg-white/20 hover:text-white">
                Liên Hệ Tư Vấn
              </Button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
