-- Fix time_logs foreign key constraint
-- Run this script in MySQL Workbench or your MySQL client

USE autoserve;

-- Drop the old foreign key constraint that references employees table
ALTER TABLE time_logs DROP FOREIGN KEY FKl5g9p1t1iplbc7bxu49mmns2q;

-- Add the correct foreign key constraint that references users table
ALTER TABLE time_logs 
ADD CONSTRAINT fk_time_logs_employee 
FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE;

-- Verify the change
SHOW CREATE TABLE time_logs;

-- You should see the new constraint: time_logs_employee
SELECT 'Foreign key constraint updated successfully!' AS Status;
