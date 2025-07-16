# DeepOrigin URL Shortener

A full-stack URL shortening platform with analytics, authentication, and a modern dashboard. Built with NestJS (backend) and Next.js/React (frontend), it allows users to create, manage, and track short URLs with ease.

---

## Table of Contents
- [About](#about)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [How to Run](#how-to-run)
- [How to Extend](#how-to-extend)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Next Features to Implement](#next-features-to-implement)
- [Support](#support)

---

## About

**DeepOrigin URL Shortener** is a robust, full-stack application for shortening URLs, tracking visits, and managing links. It features a secure REST API, user authentication, and a modern web dashboard for managing your links. The backend is built with NestJS and PostgreSQL, while the frontend is a Next.js app with a clean, responsive UI.

---

## Features

### Backend
- Create short URLs with auto-generated or custom slugs
- Redirect short URLs to original destinations
- Full CRUD operations for URL management
- Comprehensive URL validation (protocol, hostname, length)
- PostgreSQL database with TypeORM
- Input validation and transformation
- RESTful API design
- Authentication and user management
- Visit statistics and analytics
- Comprehensive test coverage

### Frontend
- Modern dashboard to manage your URLs
- User registration and login
- View and copy short links
- View visit statistics for each URL
- Responsive design (desktop & mobile)
- Authentication-protected routes

---

## Technologies Used

- **Backend:**
  - [NestJS](https://nestjs.com/)
  - [TypeORM](https://typeorm.io/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [Jest](https://jestjs.io/) (testing)
  - [Docker](https://www.docker.com/) (containerization)

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [React](https://react.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Shadcn UI](https://ui.shadcn.com/) (UI components)
  - [Docker](https://www.docker.com/)

---

## How to Run

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Docker & Docker Compose (for easiest setup)
- PostgreSQL (if not using Docker)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd deeporigin-url-shortener
```

### 2. Create Environment Files
Before running Docker Compose, create the following `.env` files:

#### Backend (`url-shortener-api/.env`):
```env
# Database Configuration
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=url-shortener

# Application Configuration
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

#### Frontend (`url-shortener-ui/.env`):
```env
# API base URL (should point to the backend service)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run with Docker Compose (Recommended)
This will start both the backend API and frontend UI, along with a PostgreSQL database.

```bash
docker-compose up --build
```
- Backend API: http://localhost:3000
- Frontend UI: http://localhost:3001

### 4. Manual Setup (Advanced)
#### Backend
```bash
cd url-shortener-api
pnpm install
# Set environment variables (see below)
pnpm run start:dev
```
#### Frontend
```bash
cd url-shortener-ui
pnpm install
pnpm run dev
```

### 5. Environment Variables
Set these in a `.env` file or your shell (backend):
```bash
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=url-shortener

# Application Configuration
PORT=3000
```

---
## How to Extend

See [url-shortener-api/README.md](url-shortener-api/README.md) for backend extension and development guidelines.

---
## Next Features to Implement

### High Priority

1. **Sub-Domain for Admin APIs**
   - Only allow API actions under a subdomain (e.g, admin.urlshortener.com), so that they do not interfer with the URLs to be redirected 

### Low Priority

1. **URL Health Monitoring**
    - Check if URLs are still accessible
    - Broken link detection
    - Automatic notifications

2. **Soft Deletion**

### Technical Improvements

1. **Caching Layer**
    - Redis integration for caching
    - Cache frequently accessed URLs
    - Performance optimization

2. **Database Migrations**
    - Proper migration system
    - Version control for schema changes
    - Rollback capabilities

3. **Monitoring & Logging**
    - Application monitoring
    - Structured logging
    - Error tracking and alerting