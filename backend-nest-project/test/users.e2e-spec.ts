import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Users E2E (CRUD /user)', () => {
    let app: INestApplication;
    let adminToken: string;
    let studentToken: string;
    let createdUserId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        const adminRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'dave@example.com', password: 'Password123' });
        adminToken = adminRes.body.access_token;

        const studentRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'alice@example.com', password: 'Password123' });
        studentToken = studentRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    // ── POST /user ─────────────────────────────────────────────────────────────
    describe('POST /user', () => {
        it('should create a new user (public route)', async () => {
            const response = await request(app.getHttpServer())
                .post('/user')
                .send({
                    email: 'newuser@test.com',
                    password: 'Password123',
                    firstName: 'New',
                    lastName: 'User',
                    major1: 'Software Engineering',
                    xp: 5,
                    level: 1,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('newuser@test.com');
            expect(response.body.firstName).toBe('New');
            expect(response.body).not.toHaveProperty('password'); // nunca exponer el hash

            createdUserId = response.body.id;
        });

        it('should return 409 when email already exists', async () => {
            await request(app.getHttpServer())
                .post('/user')
                .send({
                    email: 'alice@example.com',     // ya existe en el seed
                    password: 'Password123',
                    firstName: 'Duplicate',
                    lastName: 'Alice',
                    major1: 'Biology',
                    xp: 1,
                    level: 1,
                })
                .expect(409);
        });

        it('should return 400 when major1 is invalid enum value', async () => {
            await request(app.getHttpServer())
                .post('/user')
                .send({
                    email: 'bad@test.com',
                    password: 'Password123',
                    firstName: 'Bad',
                    lastName: 'User',
                    major1: 'Carrera Invalida',
                    xp: 1,
                    level: 1,
                })
                .expect(400);
        });

        it('should return 400 when required fields are missing', async () => {
            await request(app.getHttpServer())
                .post('/user')
                .send({ email: 'incomplete@test.com' })
                .expect(400);
        });
    });

    // ── GET /user ──────────────────────────────────────────────────────────────
    describe('GET /user', () => {
        it('should return all users when authenticated', async () => {
            const response = await request(app.getHttpServer())
                .get('/user')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 401 when no token is provided', async () => {
            await request(app.getHttpServer())
                .get('/user')
                .expect(401);
        });

        it('should also work with student token', async () => {
            await request(app.getHttpServer())
                .get('/user')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(200);
        });
    });

    // ── GET /user/:id ──────────────────────────────────────────────────────────
    describe('GET /user/:id', () => {
        it('should return a user by ID', async () => {
            const response = await request(app.getHttpServer())
                .get('/user/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('email');
        });

        it('should return 404 when user does not exist', async () => {
            await request(app.getHttpServer())
                .get('/user/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });

        it('should return 401 when no token provided', async () => {
            await request(app.getHttpServer())
                .get('/user/1')
                .expect(401);
        });
    });

    // ── PATCH /user/:id ────────────────────────────────────────────────────────
    describe('PATCH /user/:id', () => {
        it('should update a user when authenticated', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/user/${createdUserId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ firstName: 'Updated' })
                .expect(200);

            expect(response.body.firstName).toBe('Updated');
        });

        it('should return 404 when user does not exist', async () => {
            await request(app.getHttpServer())
                .patch('/user/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ firstName: 'Ghost' })
                .expect(404);
        });

        it('should return 401 when no token provided', async () => {
            await request(app.getHttpServer())
                .patch('/user/1')
                .send({ firstName: 'Noauth' })
                .expect(401);
        });
    });

    // ── DELETE /user/:id ───────────────────────────────────────────────────────
    describe('DELETE /user/:id', () => {
        it('should delete the created user when Admin', async () => {
            await request(app.getHttpServer())
                .delete(`/user/${createdUserId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });

        it('should return 404 when user does not exist', async () => {
            await request(app.getHttpServer())
                .delete('/user/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });

        it('should return 401 when no token provided', async () => {
            await request(app.getHttpServer())
                .delete('/user/1')
                .expect(401);
        });
    });
});