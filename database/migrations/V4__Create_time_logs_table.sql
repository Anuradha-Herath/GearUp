-- Create time_logs table
CREATE TABLE IF NOT EXISTS time_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    description TEXT,
    employee_id BIGINT NOT NULL,
    appointment_id BIGINT,
    project_id BIGINT,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Add index for better query performance
CREATE INDEX idx_time_logs_employee ON time_logs(employee_id);
CREATE INDEX idx_time_logs_appointment ON time_logs(appointment_id);
CREATE INDEX idx_time_logs_end_time ON time_logs(end_time);
