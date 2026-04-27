import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Auth E2E (POST /auth/login, POST /auth/logout)', () => {
    let app: INestApplication;
    let adminToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /auth/login', () => {
        it('should login successfully with valid credentials (Admin)', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'dave@example.com', password: 'Password123' })
                .expect(200);

            expect(response.body).toHaveProperty('access_token');
            expect(typeof response.body.access_token).toBe('string');

            adminToken = response.body.access_token;
        });

        it('should login successfully with valid credentials (Student)', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'alice@example.com', password: 'Password123' })
                .expect(200);

            expect(response.body).toHaveProperty('access_token');
        });

        it('should return 404 when email does not exist', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'ghost@example.com', password: 'Password123' })
                .expect(404);
        });

        it('should return 401 when password is wrong', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'dave@example.com', password: 'WrongPassword' })
                .expect(401);
        });

        it('should return 400 when email is invalid format', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'not-an-email', password: 'Password123' })
                .expect(400);
        });

        it('should return 400 when body is empty', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({})
                .expect(400);
        });
    });

    
    describe('POST /auth/logout', () => {
        it('should logout successfully with valid token', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
        });

        it('should return 401 when no token is provided', async () => {
            await request(app.getHttpServer())
                .post('/auth/logout')
                .expect(401);
        });

        it('should return 401 when token is invalid', async () => {
            await request(app.getHttpServer())
                .post('/auth/logout')
                .set('Authorization', 'Bearer token.falso.aqui')
                .expect(401);
        });
    });
});