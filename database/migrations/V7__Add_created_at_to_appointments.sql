-- Add created_at column to appointments table
ALTER TABLE appointments 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;