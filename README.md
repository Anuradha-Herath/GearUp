# AutoServe - Automobile Service Management System

This is a monolithic enterprise-grade application for managing automobile services, built with Spring Boot backend and React frontend.

## Features

### Customer Functionality
- Secure login & signup
- Dashboard to view service/project progress in real-time
- Book an appointment for a vehicle service
- Request a modification (treated as a vehicle project)
- Mobile-friendly updates for service/project progress
- Chatbot integration using a Generative AI model to check available service slots

### Employee Functionality
- Login & authentication
- Ability to log time against each project/service
- Track progress and update status of ongoing services/projects
- View upcoming appointments and requests

### System Requirements
- Real-time updates using WebSockets
- Containerized deployment (frontend + backend + database)
- Proper role-based access control (customers vs. employees/admins)
- Secure handling of user and project/service data

## Architecture

The application follows a monolithic architecture with:
- **Backend**: Spring Boot with JPA, WebSocket, Security, Validation
- **Frontend**: React with Vite, Tailwind CSS
- **Database**: SQL Server
- **Deployment**: Docker and Kubernetes

## Setup

1. Ensure you have Docker and Docker Compose installed.
2. Navigate to the `docker` directory.
3. Run `docker-compose up --build` to start the application.
4. Access the frontend at `http://localhost:3000` and backend at `http://localhost:8080`.

## Development

- Backend: Use Maven to build and run.
- Frontend: Use npm to install dependencies and run `npm run dev`.

## API Documentation

See `docs/api-spec.yaml` for OpenAPI specification.