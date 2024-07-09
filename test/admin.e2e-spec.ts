import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/Admin/create (POST)', () => {
    it.skip('TC_AD_CREATE_009: should return status 200', () => {
      const testData = {
        email: 'admin@gmail.com',
        password: 'Aa@12345',
      };
      return request(app.getHttpServer())
        .post('/Admin/create')
        .set('Authorization', process.env.CREATE_ADMIN_TOKEN)
        .send(testData)
        .expect(200);
    });
  });

  describe('/Admin/login (POST)', () => {
    it('TC_AD_LOGIN_001: should return accessToken and refreshToken', async () => {
      const testData = {
        email: 'admin@gmail.com',
        password: 'Aa@12345',
      };
      const response = await request(app.getHttpServer())
        .post('/Admin/login')
        .send(testData)
        .expect(200);

      jwtToken = response.body.accessToken;
      return expect(response.body.accessToken).toBeDefined();
    });

    it('TC_AD_LOGIN_002: should return status 400 and message', async () => {
      const testData = {
        password: 'Aa@12345',
      };
      const response = await request(app.getHttpServer())
        .post('/Admin/login')
        .send(testData)
        .expect(400);

      return expect(response.body.message).toBeDefined();
    });

    it('TC_AD_LOGIN_003: should return status 400 and message', async () => {
      const testData = {
        email: '',
        password: 'Aa@12345',
      };
      const response = await request(app.getHttpServer())
        .post('/Admin/login')
        .send(testData)
        .expect(400);

      return expect(response.body.message).toBeDefined();
    });
  });
});
