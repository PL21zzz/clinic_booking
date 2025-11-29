import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Descriptions, Radio, message, Divider } from 'antd';
import { DollarCircleOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosClient from '../api/axiosClient';

const CashierPage: React.FC = () => {
  const [unpaidList, setUnpaidList] = useState([]); // Danh sách chờ thanh toán
  const [loading, setLoading] = useState(false);

  // State cho Modal thanh toán
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [invoiceDetail, setInvoiceDetail] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // 1. Lấy danh sách bệnh nhân đã khám xong (completed)
  // Lưu ý: Thực tế cần API lọc ra những ai chưa có trong bảng invoices.
  // Ở đây tạm thời lấy list appointment và lọc ở client cho nhanh demo.
  const fetchUnpaid = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/appointments');
      // Chỉ lấy status 'completed' (đã khám xong mới thu tiền)
      const completed = res.data.data.filter((app: any) => app.status === 'completed');
      setUnpaidList(completed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaid();
  }, []);

  // 2. Xem chi tiết hóa đơn (Gọi API Preview)
  const handleOpenPayment = async (record: any) => {
    setSelectedAppointment(record);
    try {
      const res = await axiosClient.get(`/invoices/preview/${record.id}`);
      setInvoiceDetail(res.data.data);
      setIsModalOpen(true);
    } catch (error) {
      message.error("Lỗi tính toán viện phí");
    }
  };

  // 3. Xử lý thanh toán
  const handleConfirmPayment = async () => {
    try {
      await axiosClient.post('/invoices/pay', {
        appointment_id: selectedAppointment.id,
        total_amount: invoiceDetail.total_amount,
        payment_method: paymentMethod
      });
      message.success("Thanh toán thành công! In hóa đơn...");
      setIsModalOpen(false);
      fetchUnpaid(); // Load lại danh sách
    } catch (error) {
      message.error("Thanh toán thất bại");
    }
  };

  const columns = [
    { title: 'Mã HS', dataIndex: 'id', width: 80 },
    { title: 'Bệnh nhân', dataIndex: 'patient_name', render: (t: string) => <b>{t}</b> },
    { title: 'Dịch vụ', dataIndex: 'service_name' },
    { title: 'Ngày khám', dataIndex: 'appointment_date', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          danger
          icon={<DollarCircleOutlined />}
          onClick={() => handleOpenPayment(record)}
        >
          Thu viện phí
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card title="💰 Quầy Thu Ngân - Danh Sách Chờ Thanh Toán" className="shadow-md">
        <Table dataSource={unpaidList} columns={columns} rowKey="id" loading={loading} />
      </Card>

      {/* MODAL THANH TOÁN */}
      <Modal
        title={<div className="text-xl font-bold text-green-700"><CalculatorOutlined /> HÓA ĐƠN VIỆN PHÍ</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>Hủy</Button>,
          <Button key="submit" type="primary" size="large" className="bg-green-600" onClick={handleConfirmPayment}>
            Xác nhận Đã thu tiền
          </Button>
        ]}
        width={600}
      >
        {invoiceDetail && (
          <div className="space-y-4">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Bệnh nhân"><b>{selectedAppointment?.patient_name}</b></Descriptions.Item>
              <Descriptions.Item label="Tiền Dịch vụ (Khám)">
                {invoiceDetail.service_fee.price.toLocaleString()} đ ({invoiceDetail.service_fee.name})
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="horizontal" className="text-sm">Chi tiết tiền thuốc</Divider>
            <ul className="list-disc pl-5 text-gray-600">
              {invoiceDetail.medicines.length === 0 ? <li>Không kê thuốc</li> :
                invoiceDetail.medicines.map((med: any, idx: number) => (
                  <li key={idx} className="flex justify-between">
                    <span>{med.name} (x{med.quantity})</span>
                    <span>{parseFloat(med.total).toLocaleString()} đ</span>
                  </li>
                ))}
            </ul>

            <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center mt-4 border border-green-200">
              <span className="text-lg font-bold text-gray-700">TỔNG CỘNG:</span>
              <span className="text-2xl font-bold text-red-600">
                {invoiceDetail.total_amount.toLocaleString()} VND
              </span>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Hình thức thanh toán:</p>
              <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                <Radio value="cash">Tiền mặt</Radio>
                <Radio value="banking">Chuyển khoản</Radio>
                <Radio value="card">Thẻ tín dụng</Radio>
              </Radio.Group>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CashierPage;
