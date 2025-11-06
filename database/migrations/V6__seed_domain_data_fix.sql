-- V6__seed_domain_data_fix.sql
-- Fixes for V5: insert vehicles, projects, time_logs, appointments using single-row INSERTs to avoid subselects in multi-row VALUES

-- Vehicles (single-row inserts)
INSERT INTO vehicles (company, model, vehicle_number, year, customer_id)
  VALUES ('Toyota', 'Corolla', 'ABC-1234', 2018, (SELECT id FROM customers WHERE email='alice@example.com'));

INSERT INTO vehicles (company, model, vehicle_number, year, customer_id)
  VALUES ('Honda', 'Civic', 'XYZ-5678', 2020, (SELECT id FROM customers WHERE email='bob@example.com'));

-- Projects
INSERT INTO projects (name, description, status, start_date, customer_id, vehicle_id)
  VALUES ('Oil Change Campaign', 'Routine oil change project for fleet', 'OPEN', NOW(), (SELECT id FROM customers WHERE email='alice@example.com'), (SELECT id FROM vehicles WHERE vehicle_number='ABC-1234'));

-- Time logs
INSERT INTO time_logs (description, start_time, end_time, employee_id, project_id)
  VALUES ('Initial inspection', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), (SELECT id FROM employees WHERE email='tom.tech@example.com'), (SELECT id FROM projects WHERE name='Oil Change Campaign'));

-- Appointments (single-row inserts)
INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
  VALUES ('Check engine light on', CURDATE(), 49.99, 'Customer reported engine light', 'SCHEDULED', '09:30:00', (SELECT id FROM customers WHERE email='alice@example.com'), NULL, 1, (SELECT id FROM vehicles WHERE vehicle_number='ABC-1234'));

INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
  VALUES ('Tire noise', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 29.99, 'Rotate and inspect tires', 'SCHEDULED', '11:00:00', (SELECT id FROM customers WHERE email='bob@example.com'), (SELECT id FROM employees WHERE email='tom.tech@example.com'), 2, (SELECT id FROM vehicles WHERE vehicle_number='XYZ-5678'));

-- End of fix file
