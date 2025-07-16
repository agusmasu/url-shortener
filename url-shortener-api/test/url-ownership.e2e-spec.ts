import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('URL Ownership (e2e)', () => {
  let app: INestApplication;
  let user1Token: string;
  let user2Token: string;
  let user1UrlId: number;

  const user1 = { email: 'user1@example.com', password: 'password1' };
  const user2 = { email: 'user2@example.com', password: 'password2' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Register users
    await request(app.getHttpServer()).post('/user').send(user1);
    await request(app.getHttpServer()).post('/user').send(user2);

    // Login users
    const res1 = await request(app.getHttpServer()).post('/user/login').send(user1);
    user1Token = res1.body.access_token;
    const res2 = await request(app.getHttpServer()).post('/user/login').send(user2);
    user2Token = res2.body.access_token;
  });

  it('User1 can create a URL', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/url')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ url: 'https://user1.com' })
      .expect(201);
    expect(res.body.url).toBe('https://user1.com');
    expect(res.body.id).toBeDefined();
    user1UrlId = res.body.id;
  });

  it('User1 can access their URL', async () => {
    await request(app.getHttpServer())
      .get(`/url/${user1UrlId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);
  });

  it('User2 cannot access User1 URL', async () => {
    await request(app.getHttpServer())
      .get(`/url/${user1UrlId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .expect(403);
  });

  it('User2 cannot update User1 URL', async () => {
    await request(app.getHttpServer())
      .patch(`/url/${user1UrlId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ url: 'https://hacker.com' })
      .expect(403);
  });

  it('User2 cannot delete User1 URL', async () => {
    await request(app.getHttpServer())
      .delete(`/url/${user1UrlId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .expect(403);
  });

  it('User1 can delete their URL', async () => {
    await request(app.getHttpServer())
      .delete(`/url/${user1UrlId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
}); 