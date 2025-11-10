# AutoServe - Automobile Service Management System

<div align="center">

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![Java](https://img.shields.io/badge/Java-17-orange)
![React](https://img.shields.io/badge/React-19-61dafb)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-0052cc)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive full-stack application for managing automobile services, appointments, and customer relationships.

[Features](#features) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Documentation](#documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Overview

AutoServe is a modern automobile service management system that streamlines the booking, scheduling, and management of vehicle services. The application supports multiple user roles (Customer, Employee, Admin) with role-based access control and real-time updates via WebSocket.

**Key Capabilities:**
- 📅 Appointment scheduling and management
- 🚗 Vehicle management and service tracking
- 👥 Multi-role user management (Customer, Employee, Admin)
- 💬 Real-time communication via WebSocket
- 📊 Analytics and reporting dashboards
- 🤖 AI-powered chatbot support
- 📄 PDF generation and reporting
- 🔐 JWT-based authentication and authorization

---

## ✨ Features

### For Customers
- Browse and book services
- Manage vehicle information
- Track appointment history
- Real-time appointment status updates
- Download service reports
- Provide feedback and ratings
- Chat with support via AI chatbot

### For Employees
- View assigned appointments
- Manage service records
- Update appointment status
- Track customer details and vehicle information
- Generate service reports
- Time logging capabilities

### For Administrators
- Dashboard with analytics and metrics
- User and role management
- Service configuration
- System monitoring
- Report generation and export
- Feedback management

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Database:** MySQL 8.0 with JPA/Hibernate
- **Security:** Spring Security with JWT authentication
- **Real-time:** WebSocket for live updates
- **API:** RESTful API with Swagger/OpenAPI documentation
- **Email:** SendGrid integration
- **Validation:** Bean Validation (JSR-380)
- **PDF Generation:** OpenPDF
- **Build:** Maven 3.9.9

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7.1.12
- **Styling:** Tailwind CSS 3.4.0
- **Charts:** Chart.js, Recharts
- **Routing:** React Router 7.9.3
- **File Upload:** Uploadthing
- **Icons:** Lucide React
- **PDF Export:** jsPDF

### DevOps & Infrastructure
- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Build Tool:** Maven
- **CI/CD:** GitHub Actions ready

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                  - Dashboard & UI Components                 │
│                  - Real-time Updates (WebSocket)             │
│                  - Chart.js & Recharts Analytics             │
└────────────────────────────┬────────────────────────────────┘
                             │
                      HTTP / WebSocket
                             │
┌────────────────────────────▼────────────────────────────────┐
│              Backend (Spring Boot 3.2.0)                    │
├─────────────────────────────────────────────────────────────┤
│  Controllers │ Services │ Repositories │ Entities           │
│  ────────────────────────────────────────────────────────   │
│  - Authentication & Authorization (JWT)                    │
│  - Business Logic & Validation                              │
│  - WebSocket Support                                        │
│  - Email Notifications (SendGrid)                           │
│  - PDF Generation                                           │
│  - AI Chatbot Integration (Gemini API)                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                        JPA/Hibernate
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    MySQL 8.0 Database                       │
│  - Users, Services, Appointments, Vehicles                  │
│  - Time Logs, Projects, Feedback                            │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication:** JWT token generation and validation
2. **API Requests:** RESTful endpoints with role-based access control
3. **Business Processing:** Service layer handles core logic
4. **Database Operations:** JPA repositories manage data persistence
5. **Real-time Updates:** WebSocket events for live notifications
6. **External Integrations:** Email (SendGrid), AI (Gemini API)

---

## 📁 Project Structure

```
GearUp/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/autoserve/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA Entities
│   │   │   │   ├── repository/      # Data Access Layer
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   ├── exception/       # Custom Exceptions
│   │   │   │   └── util/            # Utility Classes
│   │   │   └── resources/
│   │   │       ├── application.yml  # Configuration
│   │   │       └── db/migration/    # Flyway SQL Migrations
│   │   └── test/                    # Unit Tests
│   ├── pom.xml                      # Maven Configuration
│   ├── Dockerfile                   # Backend Docker Image
│   ├── .env.example                 # Environment Variables Template
│   └── appointments.csv             # Sample Data
│
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable React Components
│   │   │   ├── appointment/         # Appointment Components
│   │   │   ├── dashboard/           # Dashboard Components
│   │   │   ├── employee/            # Employee Components
│   │   │   ├── admin/               # Admin Components
│   │   │   └── common/              # Common UI Components
│   │   ├── pages/                   # Page Components
│   │   ├── context/                 # React Context (State Management)
│   │   ├── hooks/                   # Custom React Hooks
│   │   ├── services/                # API Service Functions
│   │   ├── layouts/                 # Layout Components
│   │   └── utils/                   # Utility Functions
│   ├── package.json                 # NPM Dependencies
│   ├── vite.config.js              # Vite Configuration
│   ├── tailwind.config.js           # Tailwind CSS Configuration
│   ├── Dockerfile                   # Frontend Docker Image
│   └── .env.example                 # Environment Variables Template
│
├── database/                        # Database Configuration
│   └── migrations/                  # Flyway SQL Migration Scripts
│       ├── V1__Create_users_table.sql
│       ├── V2__Create_services_table.sql
│       ├── V3__Create_vehicles_and_appointments_tables.sql
│       └── ...
│
├── docker/                          # Docker Configuration
│   ├── docker-compose.yml           # Local Development Compose
│   ├── docker-compose.prod.yml      # Production Compose
│   ├── backend.Dockerfile           # Backend Image Definition
│   ├── frontend.Dockerfile          # Frontend Image Definition
│   └── docs/                        # Docker Documentation
│
├── k8s/                             # Kubernetes Configuration
│   ├── deployment-backend.yaml      # Backend Deployment
│   ├── deployment-frontend.yaml     # Frontend Deployment
│   ├── deployment-db.yaml           # Database Deployment
│   ├── service-backend.yaml         # Backend Service
│   ├── service-frontend.yaml        # Frontend Service
│   └── secrets-configmap.yaml       # Secrets & ConfigMaps
│
├── docs/                            # Documentation
│   ├── architecture.md              # Architecture Documentation
│   ├── api-spec.yaml               # OpenAPI Specification
│   ├── CI-CD-README.md             # CI/CD Pipeline Guide
│   └── chatbot/                    # Chatbot Documentation
│
├── scripts/                         # Utility Scripts
│   ├── run-migrations.ps1          # Database Migration Script
│   ├── create-db-and-migrate.ps1   # DB Setup Script
│   └── security-check.ps1          # Security Check Script
│
└── README.md                        # This File
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** - [Download](https://adoptopenjdk.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Maven 3.9+** - [Download](https://maven.apache.org/)
- **MySQL 8.0+** - [Download](https://www.mysql.com/)
- **Docker & Docker Compose** (optional) - [Download](https://www.docker.com/)
- **Git** - [Download](https://git-scm.com/)

### Quick Start (Local Development)

#### 1. Clone the Repository

```bash
git clone https://github.com/Anuradha-Herath/AutoServe.git
cd AutoServe
```

#### 2. Setup Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# Edit .env and set:
# - DATABASE_PASSWORD
# - JWT_SECRET
# - SENDGRID_API_KEY
# - etc.

# Build with Maven
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

API Documentation: `http://localhost:8080/swagger-ui.html`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with backend URL
# VITE_API_URL=http://localhost:8080

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 4. Setup Database

```bash
# Using MySQL CLI
mysql -u root -p -e "CREATE DATABASE autoserve;"

# Flyway migrations will run automatically when backend starts
# Or manually run:
# cd backend
# mvn flyway:migrate
```

### Docker Setup (Recommended)

```bash
# Navigate to docker directory
cd docker

# Copy and configure environment
cp ../.env.example .env

# Start all services
docker-compose up -d

# Services will be available:
# - Backend: http://localhost:8080
# - Frontend: http://localhost:3000
# - Database: localhost:3306
# - Adminer (DB UI): http://localhost:8081
```

---

## 💻 Development

### Project Commands

#### Backend (Maven)

```bash
# Build the project
mvn clean install

# Run tests
mvn test

# Run the application
mvn spring-boot:run

# Generate test coverage report
mvn test jacoco:report

# Run security check
mvn dependency-check:check

# Build JAR file
mvn clean package
```

#### Frontend (Node.js)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Environment Variables

#### Backend (.env)

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=autoserve
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password

# JWT
JWT_SECRET=your-very-secure-secret-key-minimum-256-bits
JWT_EXPIRATION=86400000

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@autoserve.com

# Spring
SPRING_PROFILES_ACTIVE=dev

# Gemini API (for chatbot)
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=AutoServe
```

### Database Schema

Key tables:
- **users** - User accounts with roles
- **services** - Available automobile services
- **vehicles** - Customer vehicles
- **appointments** - Service appointments
- **time_logs** - Service time tracking
- **projects** - Service projects
- **feedbacks** - User feedback and ratings

View migrations in `database/migrations/` for complete schema.

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

#### Services
- `GET /api/services` - List all services
- `GET /api/services/{id}` - Get service details
- `POST /api/services` - Create service (Admin)

#### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

#### Vehicles
- `GET /api/vehicles` - List user vehicles
- `POST /api/vehicles` - Add vehicle
- `PUT /api/vehicles/{id}` - Update vehicle

#### Dashboard (Admin)
- `GET /api/admin/dashboard/metrics` - Dashboard metrics
- `GET /api/admin/reports` - Generate reports

Full API documentation available at `/swagger-ui.html` when backend is running.

---

## 📦 Deployment

### Docker Deployment

#### Development

```bash
cd docker
docker-compose up -d
```

#### Production

```bash
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

See [Docker Deployment Guide](./docker/README.md) for detailed instructions.

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get svc

# View logs
kubectl logs -f deployment/backend-deployment

# Troubleshoot
kubectl describe pod <pod-name>
```

See [Kubernetes Configuration](./k8s/) for more details.

### Environment Configuration

#### Development
```yaml
SPRING_PROFILES_ACTIVE: dev
DATABASE_HOST: localhost
LOG_LEVEL: DEBUG
```

#### Production
```yaml
SPRING_PROFILES_ACTIVE: prod
DATABASE_HOST: mysql-service
LOG_LEVEL: INFO
JWT_SECRET: <secure-key>
```

---

## 📚 Documentation

- **[Architecture Documentation](./docs/architecture.md)** - System design and components
- **[Docker Deployment Guide](./docker/README.md)** - Docker and containerization
- **[API Specification](./docs/api-spec.yaml)** - OpenAPI/Swagger documentation
- **[CI/CD Pipeline](./docs/CI-CD-README.md)** - GitHub Actions workflows
- **[MySQL Configuration](./docker/docs/MYSQL_CONFIGURATION.md)** - Database setup
- **[Chatbot Documentation](./docs/chatbot/)** - AI chatbot integration
- **[Kubernetes Deployment](./k8s/)** - K8s configuration files

---

## 🔧 Troubleshooting

### Backend Issues

**Backend won't start**
```bash
# Check logs
mvn spring-boot:run

# Check database connection
mysql -u root -p -h localhost -e "SELECT 1"

# Verify environment variables
cat .env
```

**Database connection errors**
```bash
# Ensure MySQL is running
# Windows: net start MySQL80
# Linux: sudo systemctl start mysql

# Test connection
mysql -u root -p -h localhost
```

**Port already in use**
```bash
# Change port in application.yml
# Or kill existing process
# Windows: netstat -ano | findstr :8080
# Linux: lsof -i :8080
```

### Frontend Issues

**Dependencies not installing**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
# Check Node version
node --version  # Should be 18+

# Clear vite cache
rm -rf .vite

# Rebuild
npm run build
```

### Docker Issues

**Container exits immediately**
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose config
```

**Port conflicts**
```bash
# Change ports in docker-compose.yml
# Or stop conflicting containers
docker ps
docker stop <container-id>
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Standards

- Follow [Spring Boot Best Practices](https://spring.io/guides)
- Write unit tests for new features
- Maintain >80% code coverage
- Use meaningful commit messages
- Update documentation for API changes

---

## 📊 Project Status

- ✅ Core functionality implemented
- ✅ Authentication & Authorization
- ✅ Real-time updates via WebSocket
- ✅ Docker containerization
- ✅ Kubernetes ready
- 🔄 CI/CD pipeline configuration
- 📋 Additional features under development

---

## 🔐 Security

- JWT-based authentication with configurable expiration
- Role-based access control (RBAC)
- SQL injection prevention via parameterized queries
- XSS protection
- CORS configuration
- Secure password hashing (BCrypt)
- Environment variable protection for sensitive data

For security concerns, please report privately to the maintainers.

---




<div align="center">

**Made with ❤️ for better automobile service management**

[⬆ Back to Top](#autoserve---automobile-service-management-system)

</div>
