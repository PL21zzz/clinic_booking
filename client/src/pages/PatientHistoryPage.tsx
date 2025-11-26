import React, { useEffect, useState } from 'react';
import { Timeline, Tag, Spin, Empty, Button, Modal, Table, Avatar} from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientHistoryPage: React.FC = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Modal đơn thuốc
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState([]);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu chưa đăng nhập thì đuổi về trang Login
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/medical-records/history`, {
          // 3. THAY ID CỨNG BẰNG user.id
          params: { patient_id: user.id }
        });
        setRecords(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ chạy khi có user.id
    if (user?.id) fetchHistory();

  }, [user]); // Thêm dependency user

  const handleViewPrescription = async (appointmentId: number) => {
    try {
      setLoadingPrescription(true);
      setIsModalOpen(true);
      const res = await axios.get(`http://localhost:3000/api/prescriptions/${appointmentId}`);
      setCurrentPrescription(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPrescription(false);
    }
  };

  const columns = [
    { title: 'Tên thuốc', dataIndex: 'medicine_name', key: 'name', render: (t:any) => <b className="text-blue-700">{t}</b> },
    { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: 'SL', dataIndex: 'quantity', key: 'qty', width: 80, render: (q:any) => <Tag color="blue">{q}</Tag> },
    { title: 'Liều dùng', dataIndex: 'dosage', key: 'dosage' },
  ];

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Spin size="large" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* 1. HEADER PROFILE (Tạo điểm nhấn đầu trang) */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-10 px-4 mb-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <Avatar size={80} icon={<UserOutlined />} className="bg-white text-blue-600 shadow-md" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold m-0 text-white">Hồ Sơ Sức Khỏe</h1>
            <p className="text-blue-100 mt-2 opacity-90">Theo dõi lịch sử khám bệnh và đơn thuốc của bạn</p>
            <div className="flex gap-4 mt-3 justify-center md:justify-start">
              <Tag color="blue" className="border-none text-sm px-3 py-1">Mã BN: #{user?.id}</Tag>
              <Tag color="cyan" className="border-none text-sm px-3 py-1">Thành viên Hạng Bạc</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TIMELINE CONTENT */}
      <div className="max-w-4xl mx-auto px-4">
        {records.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center">
             <Empty description="Bạn chưa có lịch sử khám bệnh nào." />
             <Button type="primary" className="mt-4 bg-blue-600">Đặt lịch ngay</Button>
          </div>
        ) : (
          <Timeline className="p-4">
            {records.map((rec: any) => (
              <Timeline.Item
                key={rec.id}
                dot={<div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>}
                className="pb-10"
              >
                {/* DATE BADGE */}
                <div className="mb-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit">
                    <CalendarOutlined /> {dayjs(rec.appointment_date).format('DD tháng MM, YYYY')}
                  </span>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  {/* Dải màu trang trí bên trái */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>

                  {/* Header Card */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 m-0 flex items-center gap-2">
                        BS. {rec.doctor_name}
                      </h3>
                      <p className="text-gray-400 text-sm m-0 mt-1 flex items-center gap-1">
                        <ClockCircleOutlined /> {dayjs(rec.created_at).format('HH:mm')}
                      </p>
                    </div>
                    <Tag color="cyan" className="px-3 py-1 text-sm font-medium rounded-lg m-0">
                      {rec.service_name}
                    </Tag>
                  </div>

                  {/* Body Card (Grid layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột Chẩn đoán */}
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Chẩn đoán & Triệu chứng</p>
                      <p className="text-gray-800 font-medium mb-1">{rec.diagnosis}</p>
                      {/* Tách triệu chứng ra hiển thị cho đẹp nếu muốn, ở đây đang gộp */}
                    </div>

                    {/* Cột Điều trị */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Hướng điều trị</p>
                      <p className="text-gray-800 whitespace-pre-line">{rec.treatment_plan}</p>
                      {rec.notes && (
                         <p className="text-gray-500 text-sm mt-2 italic border-t border-green-200 pt-2">
                           Note: {rec.notes}
                         </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Card: Nút xem đơn thuốc */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="default"
                      size="large"
                      className="flex items-center gap-2 border-blue-200 text-blue-600 hover:text-blue-700 hover:border-blue-400 bg-blue-50/50 rounded-xl px-6"
                      onClick={() => handleViewPrescription(rec.appointment_id)}
                    >
                      <FileTextOutlined /> Xem đơn thuốc
                    </Button>
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </div>

      {/* MODAL ĐƠN THUỐC */}
      <Modal
        title={<div className="text-xl font-bold text-blue-700 flex items-center gap-2"><MedicineBoxOutlined /> Đơn Thuốc Chi Tiết</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)} className="rounded-lg">Đóng</Button>,
          <Button key="print" type="primary" className="bg-blue-600 rounded-lg">In đơn thuốc</Button>
        ]}
        width={700}
        centered
      >
        <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm text-blue-800">
          Lưu ý: Vui lòng mua thuốc đúng liều lượng và uống thuốc theo chỉ dẫn của bác sĩ. Tái khám đúng hẹn.
        </div>
        <Table
          dataSource={currentPrescription}
          columns={columns}
          rowKey="id"
          loading={loadingPrescription}
          pagination={false}
          bordered
          locale={{ emptyText: 'Lần khám này bác sĩ không kê đơn thuốc.' }}
        />
      </Modal>
    </div>
  );
};

export default PatientHistoryPage;
