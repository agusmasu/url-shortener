import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
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
        .post('/url')
        .send({ url: 'https://www.example.com' })
        .expect(201);
      expect(res.body.url).toBe('https://www.example.com');
      expect(res.body.slug).toBeDefined();
    });
    it('rejects an invalid URL', async () => {
      await request(app.getHttpServer())
        .post('/url')
        .send({ url: 'https://' })
        .expect(400);
    });
    it('rejects localhost', async () => {
      await request(app.getHttpServer())
        .post('/url')
        .send({ url: 'http://localhost:3000' })
        .expect(400);
      await request(app.getHttpServer())
        .post('/url')
        .send({ url: 'http://127.0.0.1' })
        .expect(400);
    });
    it('rejects a URL that is too long', async () => {
      const longUrl = 'https://www.example.com/' + 'a'.repeat(2050);
      await request(app.getHttpServer())
        .post('/url')
        .send({ url: longUrl })
        .expect(400);
    });
    it('auto-adds protocol if missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/url')
        .send({ url: 'google.com' })
        .expect(201);
      expect(res.body.url).toBe('https://google.com');
    });
  });
});
