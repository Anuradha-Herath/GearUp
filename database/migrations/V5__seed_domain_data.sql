-- V5__seed_domain_data.sql
-- Seed customers, users (dev admin placeholder), employees, vehicles, projects, time_logs and appointments

-- Customers
INSERT INTO customers (email, name, phone) VALUES
  ('alice@example.com', 'Alice Johnson', '+1-555-0101'),
  ('bob@example.com', 'Bob Smith', '+1-555-0202');

-- Users (dev placeholder). NOTE: password is plaintext for convenience in dev; change to a bcrypt hash or create users via the API for real auth testing.
INSERT INTO users (email, enabled, is_active, password, phone_number, role, username) VALUES
  ('admin@example.com', b'1', 1, 'admin', '+1-555-0000', 'ROLE_ADMIN', 'admin');

-- Employees
INSERT INTO employees (email, name, role) VALUES
  ('tom.tech@example.com', 'Tom Technician', 'TECHNICIAN'),
  ('sara.manager@example.com', 'Sara Manager', 'MANAGER');

-- Vehicles (link to customers by email)
INSERT INTO vehicles (company, model, vehicle_number, year, customer_id) VALUES
  ('Toyota', 'Corolla', 'ABC-1234', 2018, (SELECT id FROM customers WHERE email='alice@example.com')),
  ('Honda', 'Civic', 'XYZ-5678', 2020, (SELECT id FROM customers WHERE email='bob@example.com'));

-- Projects (optional domain sample)
INSERT INTO projects (name, description, status, start_date, customer_id, vehicle_id) VALUES
  ('Oil Change Campaign', 'Routine oil change project for fleet', 'OPEN', NOW(), (SELECT id FROM customers WHERE email='alice@example.com'), (SELECT id FROM vehicles WHERE vehicle_number='ABC-1234'));

-- Time logs (link to employee and project)
INSERT INTO time_logs (description, start_time, end_time, employee_id, project_id) VALUES
  ('Initial inspection', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), (SELECT id FROM employees WHERE email='tom.tech@example.com'), (SELECT id FROM projects WHERE name='Oil Change Campaign'));

-- Appointments (link to customer, vehicle and service). Use existing service IDs (1..4).
INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id) VALUES
  ('Check engine light on', CURDATE(), 49.99, 'Customer reported engine light', 'SCHEDULED', '09:30:00', (SELECT id FROM customers WHERE email='alice@example.com'), NULL, 1, (SELECT id FROM vehicles WHERE vehicle_number='ABC-1234')),
  ('Tire noise', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 29.99, 'Rotate and inspect tires', 'SCHEDULED', '11:00:00', (SELECT id FROM customers WHERE email='bob@example.com'), (SELECT id FROM employees WHERE email='tom.tech@example.com'), 2, (SELECT id FROM vehicles WHERE vehicle_number='XYZ-5678'));

-- End of seed file
