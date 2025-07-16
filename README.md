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

### Product Features
- Create short URLs with auto-generated or custom slugs
- Redirect short URLs to original destinations
- Full CRUD operations for URL management
- User registration and login
- Authentication-protected dashboard and routes
- Visit statistics and analytics for each URL
- View and copy short links
- Responsive, modern dashboard UI (desktop & mobile)
- Rate limiting to prevent abuse

### Technical Features
- Comprehensive URL validation (protocol, hostname, length)
- PostgreSQL database with TypeORM
- Input validation and transformation
- RESTful API design
- Authentication and user management
- Comprehensive test coverage

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
cd url-shortener
```

### 2. Create Environment Files
Before running Docker Compose, create the following `.env` files:

#### Backend (`url-shortener-api/.env`):
```env
# Database Configuration
# Use 'db' as the host when running with Docker Compose
# Use 'localhost' as the host when running locally without Docker
POSTGRES_HOST=db
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
# Use 'localhost' if running locally, or 'postgres' if running with Docker Compose
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

---

## How Redirection Works

When a user visits a shortened URL (e.g., `https://yourdomain.com/abc123`), the request is handled directly by the backend (NestJS API). The backend looks up the slug in the database and issues a fast HTTP 3xx redirect to the original URL. This approach ensures:

- **Maximum speed:** The user is redirected immediately, without waiting for the Next.js frontend to load in the browser.
- **Efficiency:** No unnecessary JavaScript or React code is loaded just to perform a redirect.
- **SEO and analytics:** Server-side redirects are better for search engines and can more reliably track visits.

**Why not use the frontend for redirection?**

It is possible to implement redirection in the Next.js frontend (e.g., with a dynamic `[slug]` route that fetches the original URL and then redirects). However, this would require the browser to load the entire Next.js app before redirecting, which can noticeably slow down the user experience. 

**When would frontend redirection make sense?**
- If you want to show a custom interstitial page (e.g., countdown, ads, or analytics) before redirecting.
- If you need to run custom client-side logic before sending the user to the destination.

For most use cases, backend redirection is preferred for its speed and simplicity.