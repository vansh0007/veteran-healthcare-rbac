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

# Install dependencies
npm install

# Start the system (Docker required)
npm run start:docker



# Start all containers in detached mode
docker-compose up -d

# View running containers
docker ps

# Stop containers
docker-compose down

# View logs
docker-compose logs -f



# Database
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret
POSTGRES_DB=veteran_healthcare

# JWT
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=60m

# App
PORT=3000
NODE_ENV=development


# Login and get JWT token
```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@veteran.org",
    "password": "Admin@123"
  }'
  ```


  POST /users
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "new@user.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "roles": [{"role": "veteran"}]
}



GET /organizations
Authorization: Bearer <token>



# Run unit tests
npm run:test




#Troubleshooting

# Check PostgreSQL logs
docker-compose logs postgres

# Test database connection
docker exec -it veteran-healthcare-postgres psql -U admin -d veteran_healthcare





</details><details> <summary>Migration problems</summary>
bash
# Revert and re-run migrations
npm run migration:revert
npm run migration:run

# Generate new migration
npm run migration:generate --name=YourMigrationName





Testing with cURL
1. Create Admin User (First Time Setup)
bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@veteran.org",
    "password": "Admin@123",
    "firstName": "System",
    "lastName": "Admin",
    "roles": [{"role": "admin"}]
  }'
2. Login as Admin
bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@veteran.org",
    "password": "Admin@123"
  }'
Save the returned access_token for subsequent requests.

3. Create Healthcare Provider
bash
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
4. Create Veteran User
bash
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
5. Login as Healthcare Provider
bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@veteran.org",
    "password": "Doctor@123"
  }'
6. Access Restricted Endpoints
bash
# As admin - List all users
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# As provider - Will fail (403 Forbidden)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_PROVIDER_TOKEN"
Sample Data Structure
Roles Available
admin - System administrator

provider - Healthcare provider (requires organizationId)

veteran - Veteran user

staff - Support staff (requires organizationId)

Organization Structure
json
{
  "id": 1,
  "name": "VA Medical Center",
  "address": "123 Healthcare Ave",
  "phone": "555-123-4567"
}
Troubleshooting
Database connection issues:

Verify PostgreSQL container is running: docker ps

Check logs: docker-compose logs postgres

Migration errors:

Run: npm run migration:revert then npm run migration:run

Authentication problems:

Verify JWT_SECRET in .env matches

Check token expiration (default 60 minutes)
