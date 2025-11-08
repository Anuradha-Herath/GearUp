-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    image VARCHAR(500),
    included_subservices TEXT,
    estimated_duration VARCHAR(100),
    estimated_price DECIMAL(10,2) NOT NULL,
    max_per_day INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample services
INSERT INTO services (title, short_description, image, included_subservices, estimated_duration, estimated_price, max_per_day) VALUES
('Oil Change Service', 'Complete oil change service with premium oil and filter replacement', '/images/oil-change.jpg', 'Engine oil replacement, Oil filter replacement, Fluid level check, Multi-point inspection', '45 minutes', 49.99, 10),
('Brake Service', 'Complete brake inspection and service for all four wheels', '/images/brake-service.jpg', 'Brake pad inspection, Brake fluid check, Rotor inspection, Brake system diagnosis', '2 hours', 149.99, 5),
('Tire Rotation & Balance', 'Professional tire rotation and balancing service', '/images/tire-service.jpg', 'Tire rotation, Wheel balancing, Tire pressure check, Tread depth inspection', '1 hour', 39.99, 8),
('Engine Diagnostic', 'Comprehensive engine diagnostic scan and analysis', '/images/engine-diagnostic.jpg', 'Computer diagnostic scan, Error code reading, Engine performance check, Diagnostic report', '1.5 hours', 89.99, 6),
('Battery Service', 'Battery testing, cleaning, and replacement if needed', '/images/battery-service.jpg', 'Battery load test, Terminal cleaning, Charging system check, Battery replacement (if needed)', '30 minutes', 29.99, 12);
