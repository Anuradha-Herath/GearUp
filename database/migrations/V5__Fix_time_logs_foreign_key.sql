-- Fix time_logs table foreign key constraint
-- This migration ensures the employee_id foreign key correctly references the users table

-- Note: The initial time_logs creation doesn't add a foreign key, so this migration
-- adds the necessary foreign key to link time_logs to the users table via employee_id

-- Add the foreign key constraint that references users table
ALTER TABLE time_logs 
ADD CONSTRAINT fk_time_logs_employee 
FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE;