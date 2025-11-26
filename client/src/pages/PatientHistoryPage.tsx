import React, { useEffect, useState } from 'react';
import { Card, Timeline, Tag, Typography, Spin, Empty, Descriptions } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const PatientHistoryPage: React.FC = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // GIẢ LẬP: ID bệnh nhân đang đăng nhập (Sau này lấy từ Login)
  const CURRENT_PATIENT_ID = 1;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/medical-records`, {
          params: { patient_id: CURRENT_PATIENT_ID }
        });
        setRecords(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 40, color: '#1890ff' }}>
        📒 Hồ Sơ Sức Khỏe Của Tôi
      </Title>

      {records.length === 0 ? (
        <Empty description="Bạn chưa có hồ sơ khám bệnh nào." />
      ) : (
        <Timeline mode="left">
          {records.map((rec: any) => (
            <Timeline.Item
              key={rec.id}
              label={dayjs(rec.appointment_date).format('DD/MM/YYYY')}
              dot={<MedicineBoxOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
            >
              <Card
                title={<><Tag color="blue">{rec.service_name}</Tag> BS. {rec.doctor_name}</>}
                bordered={true}
                hoverable
                style={{ marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              >
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Chẩn đoán">
                    <Text strong type="danger">{rec.diagnosis}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Điều trị">
                    <Text style={{ whiteSpace: 'pre-line' }}>{rec.treatment_plan}</Text>
                  </Descriptions.Item>
                  {rec.notes && (
                    <Descriptions.Item label="Ghi chú">
                      <Text type="secondary">{rec.notes}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </div>
  );
};

export default PatientHistoryPage;
