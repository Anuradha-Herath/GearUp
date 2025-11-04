-- Fix time_logs table foreign key constraint
-- Drop the old foreign key constraint that references employees table
ALTER TABLE time_logs DROP FOREIGN KEY FKl5g9p1t1iplbc7bxu49mmns2q;

-- Add the correct foreign key constraint that references users table
ALTER TABLE time_logs 
ADD CONSTRAINT fk_time_logs_employee 
FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE;
