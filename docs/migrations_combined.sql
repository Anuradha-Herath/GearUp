-- Database Migrations for GearUp
-- Combined migration script

-- =============== V1__Create_users_table.sql ===============
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    enabled BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    phone_number VARCHAR(20),
    verification_code VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_token_expiry BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============== V2__Create_services_table.sql ===============
CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    image VARCHAR(500),
    included_subservices TEXT,
    estimated_duration VARCHAR(100),
    estimated_price DECIMAL(10,2) NOT NULL,
    max_per_day INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO services (title, short_description, image, included_subservices, estimated_duration, estimated_price, max_per_day) VALUES
('Oil Change Service', 'Complete oil change service with premium oil and filter replacement', '/images/oil-change.jpg', 'Engine oil replacement, Oil filter replacement, Fluid level check, Multi-point inspection', '45 minutes', 49.99, 10),
('Brake Service', 'Complete brake inspection and service for all four wheels', '/images/brake-service.jpg', 'Brake pad inspection, Brake fluid check, Rotor inspection, Brake system diagnosis', '2 hours', 149.99, 5),
('Tire Rotation & Balance', 'Professional tire rotation and balancing service', '/images/tire-service.jpg', 'Tire rotation, Wheel balancing, Tire pressure check, Tread depth inspection', '1 hour', 39.99, 8),
('Engine Diagnostic', 'Comprehensive engine diagnostic scan and analysis', '/images/engine-diagnostic.jpg', 'Computer diagnostic scan, Error code reading, Engine performance check, Diagnostic report', '1.5 hours', 89.99, 6),
('Battery Service', 'Battery testing, cleaning, and replacement if needed', '/images/battery-service.jpg', 'Battery load test, Terminal cleaning, Charging system check, Battery replacement (if needed)', '30 minutes', 29.99, 12);

-- =============== V3__Create_vehicles_and_appointments_tables.sql ===============
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    vehicle_number VARCHAR(255) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    employee_id BIGINT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    additional_note TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    estimated_cost DOUBLE NOT NULL DEFAULT 0.0,
    service_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============== V3a__Create_projects_table.sql ===============
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============== V4__Create_time_logs_table.sql ===============
CREATE TABLE IF NOT EXISTS time_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    check_in_time DATETIME,
    check_out_time DATETIME,
    work_duration DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_appointment_employee (appointment_id, employee_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============== V6__Add_missing_user_columns.sql ===============
ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token_expiry BIGINT;

-- =============== V7__Add_created_at_to_appointments.sql ===============
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- =============== V10__Create_feedbacks_table.sql ===============
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);
