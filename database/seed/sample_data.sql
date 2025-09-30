-- Sample data for testing
USE autoserve;
GO

-- Insert sample customers
INSERT INTO customers (name, email, phone, password) VALUES
('John Doe', 'john.doe@example.com', '123-456-7890', '$2a$10$hashedpassword1'), -- password: password123
('Jane Smith', 'jane.smith@example.com', '098-765-4321', '$2a$10$hashedpassword2');

-- Insert sample employees
INSERT INTO employees (name, email, phone, password, role) VALUES
('Alice Johnson', 'alice.johnson@autoserve.com', '111-222-3333', '$2a$10$hashedpassword3', 'EMPLOYEE'),
('Bob Wilson', 'bob.wilson@autoserve.com', '444-555-6666', '$2a$10$hashedpassword4', 'ADMIN');

-- Insert sample vehicles
INSERT INTO vehicles (customer_id, make, model, year, vin) VALUES
(1, 'Toyota', 'Camry', 2020, '1HGCM82633A123456'),
(2, 'Honda', 'Civic', 2019, '2HGCM82633A654321');

-- Insert sample services
INSERT INTO services (customer_id, vehicle_id, description, status, appointment_date) VALUES
(1, 1, 'Oil change and tire rotation', 'PENDING', '2025-10-01 10:00:00'),
(2, 2, 'Brake inspection', 'IN_PROGRESS', '2025-09-30 14:00:00');

-- Insert sample projects
INSERT INTO projects (customer_id, vehicle_id, description, status) VALUES
(1, 1, 'Custom exhaust system installation', 'PENDING'),
(2, 2, 'Engine tuning and performance upgrade', 'IN_PROGRESS');

-- Insert sample time logs
INSERT INTO time_logs (employee_id, service_id, hours, description) VALUES
(1, 2, 2.5, 'Performed brake inspection and replaced pads');

INSERT INTO time_logs (employee_id, project_id, hours, description) VALUES
(1, 2, 4.0, 'Started engine tuning work');