import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Descriptions, message, Select, Space, InputNumber, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const DoctorCheckupPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<any[]>([]); // Danh sách thuốc trong kho

  // Load danh sách thuốc khi vào trang
  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/prescriptions/medicines');
        setMedicines(res.data.data);
      } catch (e) {
        console.error("Lỗi tải thuốc");
      }
    };
    fetchMeds();
  }, []);

  if (!appointment) return <div className="p-4">Chưa chọn bệnh nhân!</div>;

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 1. Lưu bệnh án (API cũ)
      await axios.post('http://localhost:3000/api/medical-records', {
        appointment_id: appointment.id,
        patient_id: appointment.patient_id, // Lấy từ appointment
        doctor_id: 2, // Hardcode tạm
        diagnosis: values.diagnosis,
        symptoms: values.symptoms,
        treatment_plan: values.treatment_plan,
        notes: values.notes
      });

      // 2. Lưu đơn thuốc (API mới) - Chỉ gọi nếu bác sĩ có kê thuốc
      if (values.prescriptions && values.prescriptions.length > 0) {
        await axios.post('http://localhost:3000/api/prescriptions', {
          appointment_id: appointment.id,
          medicines: values.prescriptions // Mảng thuốc gửi lên
        });
      }

      message.success('Hoàn tất khám & Kê đơn!');
      navigate('/admin');

    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card title={`🩺 Khám bệnh: ${appointment.patient_name}`} className="shadow-lg">
        <Descriptions bordered column={2} className="mb-6">
          <Descriptions.Item label="Ngày khám">{dayjs(appointment.appointment_date).format('DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Dịch vụ">{appointment.service_name}</Descriptions.Item>
        </Descriptions>

        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          {/* --- PHẦN 1: CHẨN ĐOÁN --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Form.Item label="Triệu chứng" name="symptoms" rules={[{ required: true }]}>
               <Input.TextArea rows={2} />
             </Form.Item>
             <Form.Item label="Chẩn đoán" name="diagnosis" rules={[{ required: true }]}>
               <Input />
             </Form.Item>
          </div>

          <Form.Item label="Hướng điều trị" name="treatment_plan" rules={[{ required: true }]}>
             <Input.TextArea rows={2} />
          </Form.Item>

          <Divider orientation='horizontal'>Kê Đơn Thuốc</Divider>

          {/* --- PHẦN 2: KÊ ĐƠN THUỐC (DYNAMIC FORM) --- */}
          <Form.List name="prescriptions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" className="bg-gray-50 p-3 rounded border">
                    {/* Chọn thuốc */}
                    <Form.Item
                      {...restField}
                      name={[name, 'medicine_id']}
                      rules={[{ required: true, message: 'Chọn thuốc' }]}
                      style={{ width: 250 }}
                    >
                      <Select placeholder="Chọn thuốc" showSearch optionFilterProp="children">
                        {medicines.map(med => (
                          <Option key={med.id} value={med.id}>
                            {med.name} (Tồn: {med.stock_quantity})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Số lượng */}
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'SL' }]}
                    >
                      <InputNumber placeholder="SL" min={1} />
                    </Form.Item>

                    {/* Liều dùng */}
                    <Form.Item
                      {...restField}
                      name={[name, 'dosage']}
                      rules={[{ required: true, message: 'Nhập liều dùng' }]}
                      style={{ width: 300 }}
                    >
                      <Input placeholder="VD: Sáng 1 viên, Tối 1 viên" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500 text-xl" />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm thuốc
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" size="large" loading={loading} block className="bg-green-600 hover:bg-green-700 h-12 font-bold text-lg">
              LƯU BỆNH ÁN & KÊ ĐƠN
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DoctorCheckupPage;
