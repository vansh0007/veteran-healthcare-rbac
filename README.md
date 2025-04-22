# Veteran Healthcare RBAC System

A Role-Based Access Control (RBAC) system for veteran healthcare management with JWT authentication.

![Docker](https://img.shields.io/badge/Docker-2CA5E0?logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

## Table of Contents
- [🚀 Quick Start](#-quick-start)
- [🐳 Docker Setup](#-docker-setup)
- [⚙️ Configuration](#️-configuration)
- [🔐 Authentication](#-authentication)
- [📚 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🛠️ Troubleshooting](#️-troubleshooting)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/veteran-healthcare-rbac.git
cd veteran-healthcare-rbac

```

# Install dependencies

```
npm install
```

# Start the system (Docker required)
```
npm run start:docker
```


# Start all containers in detached mode
```
docker-compose up -d
```
# View running containers
```
docker ps
```

# Stop containers
```
docker-compose down
```

# View logs
```
docker-compose logs -f
```


# Database
```
DB_HOST=localhost
DB_PORT=5432
DB_TYPE=postgres
DB_USERNAME=postgres
DB_PASSWORD=yoursecurepassword
DB_NAME=veteran_healthcare
JWT_SECRET=your_jwt_secret_key
```

# JWT
```
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=60m
```

# App
```
PORT=3000
NODE_ENV=development
```


# Login and get JWT token

```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@veteran.org",
    "password": "Admin@123"
  }'

```

  # POST /users

```Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "new@user.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "roles": [{"role": "veteran"}]
}
```


# Run unit tests
```
npm run:test
```



#Troubleshooting

# Check PostgreSQL logs
```
docker-compose logs postgres
```

# Test database connection
```
docker exec -it veteran-healthcare-postgres psql -U admin -d veteran_healthcare

```



## Migration problems

# Revert and re-run migrations
```
npm run migration:revert
npm run migration:run
```

# Generate new migration
```
npm run migration:generate --name=YourMigrationName
```




# Testing with cURL

1. Create Admin User (First Time Setup)
```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@veteran.org",
    "password": "Admin@123",
    "firstName": "System",
    "lastName": "Admin",
    "roles": [{"role": "admin"}]
  }'
```

2. Login as Admin
```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@veteran.org",
    "password": "Admin@123"
  }'

  ```
Save the returned access_token for subsequent requests.



3. Create Healthcare Provider
```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "doctor@veteran.org",
    "password": "Doctor@123",
    "firstName": "John",
    "lastName": "Doe",
    "roles": [{"role": "provider", "organizationId": 1}]
  }'
```


4. Create Veteran User
```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "veteran@example.com",
    "password": "Veteran@123",
    "firstName": "James",
    "lastName": "Smith",
    "roles": [{"role": "veteran"}]
  }'

```

5. Login as Healthcare Provider
```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@veteran.org",
    "password": "Doctor@123"
  }'
```

6. Access Restricted Endpoints

# As admin - List all users
```
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

# As provider - Will fail (403 Forbidden)
```
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_PROVIDER_TOKEN"
```

Sample Data Structure
Roles Available
admin - System administrator

provider - Healthcare provider (requires organizationId)

veteran - Veteran user

staff - Support staff (requires organizationId)

# Organization Structure
json
{
  "id": 1,
  "name": "VA Medical Center",
  "address": "123 Healthcare Ave",
  "phone": "555-123-4567"
}

# Troubleshooting

Database connection issues:

# Verify PostgreSQL container is running: 

docker ps

Check logs: docker-compose logs postgres

# Migration errors:

Run: npm run migration:revert then npm run migration:run

# Authentication problems:

Verify JWT_SECRET in .env matches

Check token expiration (default 60 minutes)







## API Documentation

# Authentication

* POST /auth/login - Authenticate user and get JWT token

Body: { email: string, password: string }

Returns: { access_token: string }

# Users

* POST /users - Create a new user (requires admin role)

Body: CreateUserDto

Returns: Created user with roles

* GET /users - List all users (requires admin role)

Returns: Array of users

# Patient Records

* GET /patient-records - List all patient records (filtered by permissions)

Returns: Array of patient records

* GET /patient-records/:id - Get specific patient record (if authorized)

Returns: Single patient record

* POST /patient-records - Create new patient record (requires owner/admin role)

Body: CreatePatientRecordDto

Returns: Created patient record

## Data Model

# Core Entities

# User
id: Primary key

email: Unique identifier

password: Hashed password

firstName, lastName: User details

isActive: Account status

roles: Array of UserRole entities

# Organization

id: Primary key

name: Organization name

description: Optional description

children: Child organizations (hierarchy)

parent: Parent organization

userRoles: Roles assigned within this org

patientRecords: Records belonging to this org

# UserRole

id: Primary key

user: Associated user

organization: Associated organization

role: Role enum (OWNER, ADMIN, VIEWER, etc.)

# PatientRecord

id: Primary key

organization: Owning organization

data: Patient record data (simplified)

createdAt, updatedAt: Timestamps

# AuditLog (for future use)

id: Primary key

action: Performed action

entity: Affected entity

entityId: Affected entity ID

userId: Acting user

timestamp: When action occurred

## Access Control Implementation

* Key Components

# Role-Based Guards:

1. RolesGuard checks if user has required roles

2. Decorators like @Roles(Role.ADMIN) define endpoint requirements

# Permission Checking:

1. Hierarchical checks (org parent/child relationships)

2. Direct role assignments

3. ole inheritance (admin inherits viewer permissions)

# Data Filtering:

1.Repository patterns filter data based on users roles

2. Organization hierarchy considered in queries

## JWT Integration:

Roles embedded in JWT for quick validation

Refresh token implementation recommended for production

## Permission Flow
User authenticates, receives JWT with roles

Request hits endpoint with @Roles() decorator

RolesGuard validates JWT and checks roles

Service layer applies additional data filtering

Repository fetches only authorized data

## Future Considerations

# Complex Scenarios

* Temporary Access:

1.Add expiration to role assignments

2. Implement delegation workflows

3. Fine-Grained Permissions:

4. Resource-specific permissions (e.g., read/write)

5. Attribute-based access control (ABAC) integration

# Advanced Hierarchy:

1. Multi-level organization trees

2. Cross-organization collaborations

# Security Enhancements

* Audit Logging:

1. Comprehensive logging of all access attempts

2. Integration with SIEM systems

# Rate Limiting:

1.Protect against brute force attacks

2. Implement on sensitive endpoints

# Data Encryption:

1. Field-level encryption for sensitive data

2. Key management system integration

## Performance Optimizations

* Caching Layer:

1. Cache permission checks for frequent users

2. Redis integration for distributed caching

# Optimized Queries:

1.Materialized views for common access patterns

2.Database indexing strategy for large datasets

# Batch Processing:

1. Bulk permission checks for batch operations

2. Asynchronous permission validation where possible

# Additional Features

1.Self-Service Portal:

2. Allow users to request elevated access

3. Approval workflows

# Multi-Factor Authentication:

1.  Required for sensitive operations

2. Integration with existing veteran auth systems

# API Gateway Integration:

1.Centralized access control

2. Request transformation based on roles

## Design Decisions

# Database Choice:

1. PostgreSQL for production (scalability, JSON support)

2. SQLite option for development simplicity

# Hierarchy Implementation:

1. Materialized Path pattern for organizations

2. Balance between query performance and update complexity

# JWT Approach:

1. Include essential roles in token

2. Periodic refresh to sync permission changes

# Testing Strategy:

1.Unit tests for core logic

2.Integration tests for API endpoints

3. E2E tests for critical user flows

# Error Handling:

1.Consistent error responses

2. No sensitive data in error messages