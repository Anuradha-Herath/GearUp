-- V7__seed_users_and_domain.sql
-- Insert user records (customers and employees as users) then insert vehicles, projects, time_logs and appointments referencing users

-- Users for customers
INSERT INTO users (email, enabled, is_active, password, phone_number, role, username) VALUES
  ('alice@example.com', b'1', 1, 'password', '+1-555-0101', 'ROLE_CUSTOMER', 'alice'),
  ('bob@example.com', b'1', 1, 'password', '+1-555-0202', 'ROLE_CUSTOMER', 'bob');

-- Users for employees (auth entries)
INSERT INTO users (email, enabled, is_active, password, phone_number, role, username) VALUES
  ('tom.tech@example.com', b'1', 1, 'techpass', '+1-555-1001', 'ROLE_EMPLOYEE', 'tom.tech'),
  ('sara.manager@example.com', b'1', 1, 'sarapass', '+1-555-1002', 'ROLE_EMPLOYEE', 'sara.manager');

-- Vehicles (single-row inserts referencing users as owners)
INSERT INTO vehicles (company, model, vehicle_number, year, customer_id)
  VALUES ('Toyota', 'Corolla', 'ABC-1234', 2018, (SELECT id FROM users WHERE email='alice@example.com'));

INSERT INTO vehicles (company, model, vehicle_number, year, customer_id)
  VALUES ('Honda', 'Civic', 'XYZ-5678', 2020, (SELECT id FROM users WHERE email='bob@example.com'));

-- Projects
INSERT INTO projects (name, description, status, start_date, customer_id, vehicle_id)
  VALUES ('Oil Change Campaign', 'Routine oil change project for fleet', 'OPEN', NOW(), (SELECT id FROM users WHERE email='alice@example.com'), (SELECT id FROM vehicles WHERE vehicle_number='ABC-1234'));

-- Time logs
INSERT INTO time_logs (description, start_time, end_time, employee_id, project_id)
  VALUES ('Initial inspection', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), (SELECT id FROM users WHERE email='tom.tech@example.com'), (SELECT id FROM projects WHERE name='Oil Change Campaign'));

-- Appointments (employee_id references users.id)
INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
  VALUES ('Check engine light on', CURDATE(), 49.99, 'Customer reported engine light', 'SCHEDULED', '09:30:00', (SELECT id FROM users WHERE email='alice@example.com'), NULL, 1, (SELECT id FROM vehicles WHERE vehicle_number='ABC-1234'));

INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
  VALUES ('Tire noise', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 29.99, 'Rotate and inspect tires', 'SCHEDULED', '11:00:00', (SELECT id FROM users WHERE email='bob@example.com'), (SELECT id FROM users WHERE email='tom.tech@example.com'), 2, (SELECT id FROM vehicles WHERE vehicle_number='XYZ-5678'));

-- End of V7
