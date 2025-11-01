-- V8__fix_owners_and_insert_remaining.sql
-- Fix vehicle owner to correct user and insert remaining domain rows idempotently

-- 1) Update existing vehicle ABC-1234 to be owned by user alice@example.com
UPDATE vehicles v
JOIN users u ON u.email = 'alice@example.com'
SET v.customer_id = u.id
WHERE v.vehicle_number = 'ABC-1234';

-- 2) Insert vehicle XYZ-5678 for bob if it does not exist
INSERT INTO vehicles (company, model, vehicle_number, year, customer_id)
SELECT 'Honda','Civic','XYZ-5678',2020,u.id
FROM users u
WHERE u.email = 'bob@example.com'
  AND NOT EXISTS (SELECT 1 FROM vehicles v2 WHERE v2.vehicle_number = 'XYZ-5678');

-- 3) Insert project for Alice if not exists
INSERT INTO projects (name, description, status, start_date, customer_id, vehicle_id)
SELECT 'Oil Change Campaign','Routine oil change project for fleet','OPEN',NOW(), cu.id, v.id
FROM users cu
JOIN vehicles v ON v.vehicle_number = 'ABC-1234'
WHERE cu.email = 'alice@example.com'
  AND NOT EXISTS (SELECT 1 FROM projects p WHERE p.name = 'Oil Change Campaign');

-- 4) Insert a time log for the project if not exists
INSERT INTO time_logs (description, start_time, end_time, employee_id, project_id)
SELECT 'Initial inspection', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), eu.id, p.id
FROM users eu
JOIN projects p ON p.name = 'Oil Change Campaign'
WHERE eu.email = 'tom.tech@example.com'
  AND NOT EXISTS (SELECT 1 FROM time_logs tl WHERE tl.description = 'Initial inspection' AND tl.project_id = p.id);

-- 5) Insert appointments idempotently
-- Appointment 1: Alice, service 1
INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
SELECT 'Check engine light on', CURDATE(), 49.99, 'Customer reported engine light', 'SCHEDULED', '09:30:00', cu.id, NULL, 1, v.id
FROM users cu
JOIN vehicles v ON v.vehicle_number = 'ABC-1234'
WHERE cu.email = 'alice@example.com'
  AND NOT EXISTS (SELECT 1 FROM appointments a WHERE a.customer_id = cu.id AND a.service_id = 1 AND a.vehicle_id = v.id);

-- Appointment 2: Bob, service 2 assigned to tom
INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
SELECT 'Tire noise', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 29.99, 'Rotate and inspect tires', 'SCHEDULED', '11:00:00', cu.id, eu.id, 2, v.id
FROM users cu
JOIN users eu ON eu.email = 'tom.tech@example.com'
JOIN vehicles v ON v.vehicle_number = 'XYZ-5678'
WHERE cu.email = 'bob@example.com'
  AND NOT EXISTS (SELECT 1 FROM appointments a WHERE a.customer_id = cu.id AND a.service_id = 2 AND a.vehicle_id = v.id);

-- End of fix
