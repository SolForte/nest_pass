import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './utils';
import { AppModule } from '../src/app.module';
import { UserFactory } from './factories/user.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let helpers: Helpers;
  let server: request.SuperTest<request.Test>;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [Helpers, UserFactory],
    }).compile();
    helpers = moduleFixture.get<Helpers>(Helpers);
    userFactory = moduleFixture.get<UserFactory>(UserFactory);
    await helpers.cleanDb();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  const INVALID_EMAIL = 'email';
  const INVALID_PASSWORD = 'password';
  const VALID_EMAIL = 'valid.test.email@email.com';
  const VALID_PASSWORD = 'Password!1@2#3$4%5';
  const VOID_EMAIL = 'void.email@email.com';

  describe('/users/sign-up (POST)', () => {
    describe('should return 400', () => {
      it('if body is missing', async () => {
        const { status } = await server.post('/users/sign-up');
        expect(status).toBe(400);
      });

      it('if given email is not valid', async () => {
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: INVALID_EMAIL });
        expect(status).toBe(400);
      });

      it('if given password is not valid', async () => {
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: VALID_EMAIL, password: INVALID_PASSWORD });
        expect(status).toBe(400);
      });
    });
    describe('should return 409', () => {
      it('if email is already registered', async () => {
        const user = await userFactory.create();
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: user.email, password: VALID_PASSWORD });

        expect(status).toBe(409);
      });
    });

    describe('should return 201', () => {
      it('if body is valid', async () => {
        const { status } = await server
          .post('/users/sign-up')
          .send({ email: VALID_EMAIL, password: VALID_PASSWORD });
        expect(status).toBe(201);
      });
    });
  });

  describe('/users/sign-in (POST)', () => {
    describe('should return 400', () => {
      it('if body is missing', async () => {
        const { status } = await server.post('/users/sign-in');
        expect(status).toBe(400);
      });

      it('if email is invalid', async () => {
        const { status } = await server
          .post('/users/sign-in')
          .send({ email: INVALID_EMAIL });
        expect(status).toBe(400);
      });
    });
    //
    describe('should return 401', () => {
      it('if user does not exist', async () => {
        const { status } = await server
          .post('/users/sign-in')
          .send({ email: VOID_EMAIL, password: VALID_PASSWORD });

        expect(status).toBe(401);
      });
    });

    describe('should return 200', () => {
      it('if user exists', async () => {
        const { status } = await server
          .post('/users/sign-in')
          .send({ email: VALID_EMAIL, password: VALID_PASSWORD });
        expect(status).toBe(200);
      });
    });
  });
});
