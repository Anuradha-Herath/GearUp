-- Add created_at column to appointments table
ALTER TABLE appointments 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing appointments to have a created_at value
-- Set created_at to current timestamp for existing records (as we don't have historical data)
UPDATE appointments 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE appointments 
MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;