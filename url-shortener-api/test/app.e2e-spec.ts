import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Sign up a test user and get the access token
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'testpassword';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password })
      .expect(201);
    accessToken = res.body.accessToken;
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/url (POST)', () => {
    it('accepts a valid URL', async () => {
      const res = await request(app.getHttpServer())
        .post('/admin/url')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ url: 'https://www.example.com' })
        .expect(201);
      expect(res.body.url).toBe('https://www.example.com');
      expect(res.body.slug).toBeDefined();
    });
    it('rejects an invalid URL', async () => {
      await request(app.getHttpServer())
        .post('/admin/url')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ url: 'https://' })
        .expect(400);
    });
    it('rejects localhost', async () => {
      await request(app.getHttpServer())
        .post('/admin/url')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ url: 'http://localhost:3000' })
        .expect(400);
      await request(app.getHttpServer())
        .post('/admin/url')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ url: 'http://127.0.0.1' })
        .expect(400);
    });
    it('rejects a URL that is too long', async () => {
      const longUrl = 'https://www.example.com/' + 'a'.repeat(2050);
      await request(app.getHttpServer())
        .post('/admin/url')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ url: longUrl })
        .expect(400);
    });
    it('auto-adds protocol if missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/admin/url')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ url: 'google.com' })
        .expect(201);
      expect(res.body.url).toBe('https://google.com');
    });
  });

  describe('Rate limiting on redirect endpoint', () => {
    let slug: string;

    beforeAll(async () => {
      // Create a short URL to use for redirection
      const res = await request(app.getHttpServer())
        .post('/admin/url')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ url: 'https://www.ratelimit-test.com' })
        .expect(201);
      slug = res.body.slug;
    });

    it('should return 429 after exceeding the rate limit', async () => {
      // Make 10 requests (should all succeed with 302 or 3xx)
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .get(`/${slug}`)
          .expect(res => {
            // Accept any redirect (3xx) or not-found (3xx) as success
            if (res.status < 300 || res.status >= 400) {
              throw new Error(`Expected redirect, got status ${res.status}`);
            }
          });
      }
      // 11th request should be rate limited
      await request(app.getHttpServer())
        .get(`/${slug}`)
        .expect(429);
    });
  });
});
