-- init.sql: File khởi tạo Database Bệnh viện

-- [PHẦN 1: CÁC BẢNG CƠ BẢN]
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(20),
    specialty_id INTEGER REFERENCES specialties(id) -- Mới thêm
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),
    duration_minutes INTEGER
);

-- [PHẦN 2: NGHIỆP VỤ KHÁM CHỮA BỆNH]
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

CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER UNIQUE REFERENCES appointments(id),
    diagnosis TEXT,
    treatment_plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [PHẦN 3: DƯỢC & TÀI CHÍNH (MỚI)]
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20),
    stock_quantity INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    expiry_date DATE
);

CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    medicine_id INTEGER REFERENCES medicines(id),
    quantity INTEGER NOT NULL,
    dosage TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    total_amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [PHẦN 4: DỮ LIỆU MẪU (SEED DATA)]
INSERT INTO specialties (name) VALUES ('Da liễu'), ('Nội tổng quát');

INSERT INTO users (full_name, email, password, role, specialty_id) VALUES
('Nguyen Van Benh Nhan', 'bn@gmail.com', '123', 'patient', NULL),
('Bac Si Minh', 'bs@gmail.com', '123', 'doctor', 1);

INSERT INTO services (name, price, duration_minutes) VALUES
('Kham Da Lieu', 300000, 30),
('Laser CO2', 1500000, 60);

INSERT INTO medicines (name, unit, stock_quantity, price) VALUES
('Panadol', 'Viên', 1000, 2000),
('Kem boi', 'Tuýp', 50, 50000);
