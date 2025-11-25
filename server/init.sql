-- 1. Tạo bảng Users (Để có bệnh nhân và bác sĩ)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(20)
);

-- 2. Tạo bảng Services (Dịch vụ) - CÁI NÀY LÀ CÁI BẠN ĐANG THIẾU
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),
    duration_minutes INTEGER
);

-- 3. Tạo bảng Appointments (Lịch hẹn)
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    appointment_date DATE,
    start_time TIME,
    end_time TIME,
    status VARCHAR(20) DEFAULT 'pending'
);

-- 4. Thêm dữ liệu mẫu (Seeding)
-- Thêm 1 Bệnh nhân (ID 1) và 1 Bác sĩ (ID 2)
INSERT INTO users (full_name, email, password, role) VALUES
('Nguyen Van A', 'bn@gmail.com', '123', 'patient'),
('Bac Si Minh', 'bs@gmail.com', '123', 'doctor');

-- Thêm Dịch vụ (ID 1 là Trị mụn)
INSERT INTO services (name, price, duration_minutes) VALUES
('Lay nhan mun', 300000, 60),
('Laser CO2', 1500000, 45);
