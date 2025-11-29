// client/src/types.ts

// 1. ENUMS (Định nghĩa các giá trị cố định)
export type UserRole = 'patient' | 'doctor' | 'admin' | 'cashier';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'paid';
export type PaymentMethod = 'cash' | 'banking' | 'card';
export type InvoiceStatus = 'unpaid' | 'paid' | 'refunded';

// 2. USER
export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;      // Có thể thiếu
  avatar?: string;     // Có thể thiếu
}

// 3. SERVICE
export interface Service {
  id: number;
  name: string;
  price: number;
  duration_minutes: number;
  description?: string;
}

// 4. APPOINTMENT (Lịch hẹn)
export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  service_id: number;
  appointment_date: string; // YYYY-MM-DD
  start_time: string;       // HH:mm:ss
  end_time: string;
  status: AppointmentStatus;

  // Các trường JOIN từ bảng khác (API bắt buộc phải trả về)
  patient_name: string;
  doctor_name: string;
  service_name: string;
}

// 5. INVOICE (Hóa đơn)
export interface InvoiceDetail {
  service_fee: { name: string; price: number };
  medicines: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total_amount: number;
}
