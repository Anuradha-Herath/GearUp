# Architecture

## Overview

The AutoServe application is designed as a monolithic system for managing automobile services. It consists of a single deployable unit containing both the backend and frontend components.

## Components

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: SQL Server with JPA/Hibernate
- **Security**: Spring Security with role-based access control
- **Real-time**: WebSocket for live updates
- **Validation**: Bean validation
- **Templates**: Thymeleaf (optional for server-side rendering)

### Frontend (React)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Routing**: React Router (to be added)

### Database
- **Type**: SQL Server
- **Migration**: Flyway/Liquibase scripts in `database/migrations/`
- **Seed Data**: Sample data in `database/seed/`

### Deployment
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions (to be configured)

## Data Flow

1. User interacts with React frontend
2. Frontend makes API calls to Spring Boot backend
3. Backend processes requests, interacts with database via JPA
4. Real-time updates sent via WebSocket
5. Responses returned to frontend

## Security

- JWT-based authentication
- Role-based access control (Customer, Employee, Admin)
- Secure password hashing
- Input validation and sanitization

## Scalability

While monolithic, the application is designed with separation of concerns:
- Controllers handle HTTP requests
- Services contain business logic
- Repositories manage data access
- DTOs for data transfer
- Entities for database mapping

For future microservices migration, each service can be extracted independently.