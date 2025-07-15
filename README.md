# DeepOrigin URL Shortener

A robust URL shortening service built with NestJS, TypeORM, and PostgreSQL. This API allows you to create short URLs from long ones, with automatic slug generation and comprehensive validation.

## Features

- ✅ Create short URLs with auto-generated slugs
- ✅ Redirect short URLs to original destinations
- ✅ Full CRUD operations for URL management
- ✅ Comprehensive URL validation (protocol, hostname, length)
- ✅ PostgreSQL database with TypeORM
- ✅ Input validation and transformation
- ✅ RESTful API design
- ✅ Comprehensive test coverage

## Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- PostgreSQL database

## How to Run

### 1. Clone the Repository

```bash
git clone <repository-url>
cd deeporigin-url-shortener
```

### 2. Install Dependencies

```bash
cd url-shortener-api
pnpm install
```

### 3. Set Up Database

Create a PostgreSQL database and set the following environment variables (or use the defaults):

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

### 4. Start the Application

#### Development Mode
```bash
pnpm run start:dev
```

#### Production Mode
```bash
pnpm run build
pnpm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Create a Short URL
```http
POST /url
Content-Type: application/json

{
  "url": "https://www.example.com/very-long-url-path"
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://www.example.com/very-long-url-path",
  "slug": "abc123",
  "createdBy": "user_1234",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Redirect to Original URL
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
  "url": "https://www.newexample.com"
}
```

### Delete URL
```http
DELETE /url/{id}
```

## How to Extend

### Project Structure

```
src/
├── app.controller.ts      # Main app controller
├── app.module.ts          # Root module configuration
├── app.service.ts         # Main app service
├── main.ts               # Application bootstrap
└── url/                  # URL module
    ├── dto/              # Data Transfer Objects
    │   ├── create-url.dto.ts
    │   └── update-url.dto.ts
    ├── entities/         # Database entities
    │   └── url.entity.ts
    ├── url.controller.ts # URL endpoints
    ├── url.module.ts     # URL module configuration
    └── url.service.ts    # URL business logic
```

### Adding New Features

#### 1. Create a New Module

```bash
# Generate a new module using NestJS CLI
nest generate module feature-name
nest generate controller feature-name
nest generate service feature-name
```

#### 2. Add Database Entity

Create a new entity in `src/feature-name/entities/`:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FeatureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

#### 3. Add DTOs

Create DTOs for data validation:

```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

#### 4. Update App Module

Register your new module and entity in `app.module.ts`:

```typescript
import { FeatureModule } from './feature-name/feature-name.module';
import { FeatureEntity } from './feature-name/entities/feature.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // ... existing config
      entities: [Url, FeatureEntity], // Add your entity
    }),
    UrlModule,
    FeatureModule, // Add your module
  ],
  // ...
})
export class AppModule {}
```

### Testing

#### Running Tests

```bash
# Unit tests
pnpm run test

# Unit tests in watch mode
pnpm run test:watch

# Test coverage
pnpm run test:cov

# E2E tests
pnpm run test:e2e
```

#### Writing Tests

##### Unit Tests
Create test files with `.spec.ts` extension:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

##### E2E Tests
Add tests to `test/app.e2e-spec.ts`:

```typescript
describe('/feature (POST)', () => {
  it('should create a new feature', async () => {
    const res = await request(app.getHttpServer())
      .post('/feature')
      .send({ name: 'test feature' })
      .expect(201);
    
    expect(res.body.name).toBe('test feature');
  });
});
```

#### Testing Best Practices

1. **Mock Dependencies**: Use Jest mocks for external services
2. **Test Edge Cases**: Include validation and error scenarios
3. **Database Testing**: Use test database or in-memory SQLite
4. **API Testing**: Test all endpoints with various inputs
5. **Coverage**: Aim for >80% test coverage

### Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format
```

## Next Features to Implement

### High Priority

1. **Custom Slugs**
   - Allow users to specify custom slugs
   - Validate slug uniqueness
   - Slug format validation (alphanumeric, length limits)

2. **Sub-Domain for Admin APIs**
   - Only allow API actions under a subdomain (e.g, admin.urlshortener.com), so that they do not interfer with the URLs to be redirected 

### Medium Priority

5. **Rate Limiting**
   - API rate limiting per user/IP
   - Prevent abuse and spam
   - Configurable limits

### Low Priority

1. **URL Health Monitoring**
    - Check if URLs are still accessible
    - Broken link detection
    - Automatic notifications

2. **Soft Deletion**

### Technical Improvements

13. **Caching Layer**
    - Redis integration for caching
    - Cache frequently accessed URLs
    - Performance optimization

14. **Database Migrations**
    - Proper migration system
    - Version control for schema changes
    - Rollback capabilities

15. **Monitoring & Logging**
    - Application monitoring
    - Structured logging
    - Error tracking and alerting

16. **Docker & Deployment**
    - Docker containerization
    - CI/CD pipeline
    - Environment-specific configurations

## Support

For support and questions, please open an issue in the repository or contact the development team.
