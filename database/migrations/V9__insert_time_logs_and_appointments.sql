-- V9__insert_time_logs_and_appointments.sql
-- Insert time_logs using employees table and insert appointments (idempotent)

-- Time log (use employees table for employee_id)
INSERT INTO time_logs (description, start_time, end_time, employee_id, project_id)
SELECT 'Initial inspection', NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR), e.id, p.id
FROM employees e
JOIN projects p ON p.name = 'Oil Change Campaign'
WHERE e.email = 'tom.tech@example.com'
  AND NOT EXISTS (SELECT 1 FROM time_logs tl WHERE tl.description = 'Initial inspection' AND tl.project_id = p.id);

-- Appointments (use users for customer and employee FK)
INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
SELECT 'Check engine light on', CURDATE(), 49.99, 'Customer reported engine light', 'SCHEDULED', '09:30:00', cu.id, NULL, 1, v.id
FROM users cu
JOIN vehicles v ON v.vehicle_number = 'ABC-1234'
WHERE cu.email = 'alice@example.com'
  AND NOT EXISTS (SELECT 1 FROM appointments a WHERE a.customer_id = cu.id AND a.service_id = 1 AND a.vehicle_id = v.id);

INSERT INTO appointments (additional_note, date, estimated_cost, service_notes, status, time, customer_id, employee_id, service_id, vehicle_id)
SELECT 'Tire noise', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 29.99, 'Rotate and inspect tires', 'SCHEDULED', '11:00:00', cu.id, eu.id, 2, v.id
FROM users cu
JOIN users eu ON eu.email = 'tom.tech@example.com'
JOIN vehicles v ON v.vehicle_number = 'XYZ-5678'
WHERE cu.email = 'bob@example.com'
  AND NOT EXISTS (SELECT 1 FROM appointments a WHERE a.customer_id = cu.id AND a.service_id = 2 AND a.vehicle_id = v.id);

-- End V9
