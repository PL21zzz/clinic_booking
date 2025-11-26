export interface Service {
  id: number;
  name: string;
  price: number; // Lưu ý: Database trả về string ở một số driver, nhưng ta cứ để number
  duration_minutes: number;
}

export interface Appointment {
  id: number;
  patient_name: string;
  service_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
