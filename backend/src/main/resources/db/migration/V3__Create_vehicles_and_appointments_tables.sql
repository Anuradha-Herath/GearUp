-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    vehicle_number VARCHAR(255) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create appointments table with updated schema
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
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE SET NULL
);
