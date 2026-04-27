// test/roles.e2e-spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Roles E2E (CRUD /role + /user-role)', () => {
    let app: INestApplication;
    let adminToken: string;
    let studentToken: string;
    let createdRoleId: number;
    let createdUserRoleId: number;

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

    describe('POST /role', () => {
        it('should create a TA role when Admin', async () => {
            const response = await request(app.getHttpServer())
                .post('/role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'TA', description: 'Teaching assistant' })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('TA');

            createdRoleId = response.body.id;
        });

        it('should return 409 when role name already exists', async () => {
            await request(app.getHttpServer())
                .post('/role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Admin' })       
                .expect(409);
        });

        it('should return 400 when role name is invalid enum', async () => {
            await request(app.getHttpServer())
                .post('/role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'SuperAdmin' })
                .expect(400);
        });

        it('should return 403 when Student tries to create a role', async () => {
            await request(app.getHttpServer())
                .post('/role')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ name: 'Professor' })
                .expect(403);
        });

        it('should return 401 when no token is provided', async () => {
            await request(app.getHttpServer())
                .post('/role')
                .send({ name: 'Professor' })
                .expect(401);
        });
    });

    describe('GET /role', () => {
        it('should return all roles when Admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/role')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 403 when Student tries to list roles', async () => {
            await request(app.getHttpServer())
                .get('/role')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });

        it('should return 401 when no token', async () => {
            await request(app.getHttpServer()).get('/role').expect(401);
        });
    });

    describe('GET /role/:id', () => {
        it('should return role by ID when Admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/role/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body.name).toBe('Admin');
        });

        it('should return 409 (ConflictException) when role does not exist', async () => {
            await request(app.getHttpServer())
                .get('/role/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(409);
        });
    });

    describe('PATCH /role/:id', () => {
        it('should update role description when Admin', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/role/${createdRoleId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'Updated TA description' })
                .expect(200);

            expect(response.body.description).toBe('Updated TA description');
        });

        it('should return 403 when Student tries to update', async () => {
            await request(app.getHttpServer())
                .patch('/role/1')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ description: 'Hack' })
                .expect(403);
        });
    });

    describe('DELETE /role/:id', () => {
        it('should return 403 when Student tries to delete', async () => {
            await request(app.getHttpServer())
                .delete(`/role/${createdRoleId}`)
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });

        it('should delete the created TA role when Admin', async () => {
            await request(app.getHttpServer())
                .delete(`/role/${createdRoleId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });

    describe('POST /user-role', () => {
        it('should assign Admin role to eve (id 5) when Admin', async () => {
            const response = await request(app.getHttpServer())
                .post('/user-role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ userId: 5, roleId: 1 })  
                .expect(201);

            expect(response.body).toHaveProperty('id');
            createdUserRoleId = response.body.id;
        });

        it('should return 409 when user already has that role', async () => {
            await request(app.getHttpServer())
                .post('/user-role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ userId: 1, roleId: 2 })  
                .expect(409);
        });

        it('should return 404 when user does not exist', async () => {
            await request(app.getHttpServer())
                .post('/user-role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ userId: 9999, roleId: 1 })
                .expect(404);
        });

        it('should return 404 when role does not exist', async () => {
            await request(app.getHttpServer())
                .post('/user-role')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ userId: 1, roleId: 9999 })
                .expect(404);
        });

        it('should return 403 when Student tries to assign role', async () => {
            await request(app.getHttpServer())
                .post('/user-role')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ userId: 5, roleId: 2 })
                .expect(403);
        });
    });

    describe('GET /user-role', () => {
        it('should return all user-roles when Admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/user-role')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 403 when Student tries to list', async () => {
            await request(app.getHttpServer())
                .get('/user-role')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });
    });

    describe('DELETE /user-role/:id', () => {
        it('should revoke the assigned role when Admin', async () => {
            await request(app.getHttpServer())
                .delete(`/user-role/${createdUserRoleId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });

        it('should return 404 when user-role does not exist', async () => {
            await request(app.getHttpServer())
                .delete('/user-role/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });
});