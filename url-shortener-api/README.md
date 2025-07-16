# URL Shortener API

A backend API for creating, managing, and tracking shortened URLs. Built with [NestJS](https://nestjs.com/) and TypeScript.

## Features

- Create short URLs for any valid link
- Redirect users to the original URL via a short slug
- Track visits (IP, user agent, referer, timestamp)
- View visit statistics and history per URL
- User authentication (if implemented)
- RESTful API endpoints

## Table of Contents

- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Usage](#docker-usage)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## API Endpoints

### Create a Shortened URL

```http
POST /url
Content-Type: application/json

{
  "url": "https://www.example.com/very-long-url"
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://www.example.com/very-long-url",
  "slug": "abc123",
  "createdBy": "user_1234",
  "createdAt": "2025-07-15T00:58:24.291Z",
  "updatedAt": "2025-07-15T00:58:24.291Z"
}
```

### Redirect to Original URL

```http
GET /{slug}
```
or
```http
GET /url/redirect/{slug}
```

### Get All URLs

```http
GET /url
```

### Get URL by ID

```http
GET /url/{id}
```

### Update URL

```http
PATCH /url/{id}
Content-Type: application/json

{
  "url": "https://www.new-example.com"
}
```

### Delete URL

```http
DELETE /url/{id}
```

### Get Visit Statistics

```http
GET /url/{id}/stats
```

**Response:**
```json
{
  "totalVisits": 150,
  "recentVisits": 25,
  "uniqueVisitors": 18
}
```

### Get Visit History

```http
GET /url/{id}/visits?limit=20&offset=0
```

### Get All Visits

```http
GET /url/visits/all?limit=50&offset=0
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- PostgreSQL

### Installation

```bash
cd url-shortener-api
pnpm install
```

### Running the API

```bash
# Development
pnpm run start

# Watch mode
pnpm run start:dev

# Production
pnpm run start:prod
```

The API will run on the port specified in your `.env` file (default: 3001).

## Environment Variables

Create a `.env` file in the `url-shortener-api` directory with the following variables:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=url-shortener
JWT_SECRET=your_jwt_secret
PORT=3001
```

## Docker Usage

You can run the API using Docker:

```bash
# Build the Docker image
docker build -t url-shortener-api .

# Run the container
docker run --env-file .env -p 3001:3001 url-shortener-api
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Project Structure

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── url/
│   ├── dto/
│   ├── entities/
│   ├── url.controller.ts
│   ├── url.module.ts
│   └── url.service.ts
├── user/
│   ├── dto/
│   ├── entities/
│   ├── user.controller.ts
│   ├── user.module.ts
│   └── user.service.ts
└── auth/
    ├── auth.guard.ts
    └── auth.module.ts
```