-- Create database
CREATE DATABASE autoserve;
GO

USE autoserve;
GO

-- Create tables
CREATE TABLE customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE employees (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL, -- 'EMPLOYEE', 'ADMIN'
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE vehicles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    make NVARCHAR(100),
    model NVARCHAR(100),
    year INT,
    vin NVARCHAR(50) UNIQUE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_id INT,
    description NVARCHAR(MAX),
    status NVARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    appointment_date DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE projects (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_id INT,
    description NVARCHAR(MAX),
    status NVARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE time_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    project_id INT,
    service_id INT,
    hours DECIMAL(5,2) NOT NULL,
    description NVARCHAR(MAX),
    log_date DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Indexes for performance
CREATE INDEX idx_services_customer_id ON services(customer_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_time_logs_employee_id ON time_logs(employee_id);