// test/permissions.e2e-spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Permissions E2E (CRUD /permission + /role-permission)', () => {
    let app: INestApplication;
    let adminToken: string;
    let studentToken: string;
    let createdPermissionId: number;
    let createdRolePermissionId: number;

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

    describe('POST /permission', () => {
        it('should create Update permission when Admin', async () => {
            const response = await request(app.getHttpServer())
                .post('/permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Update', description: 'Can update resources' })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('Update');

            createdPermissionId = response.body.id;
        });

        it('should return 409 when permission name already exists', async () => {
            await request(app.getHttpServer())
                .post('/permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Create' })    // ya existe en seed
                .expect(409);
        });

        it('should return 400 when permission name is invalid enum', async () => {
            await request(app.getHttpServer())
                .post('/permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Execute' })
                .expect(400);
        });

        it('should return 403 when Student tries to create permission', async () => {
            await request(app.getHttpServer())
                .post('/permission')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ name: 'Delete' })
                .expect(403);
        });

        it('should return 401 when no token', async () => {
            await request(app.getHttpServer())
                .post('/permission')
                .send({ name: 'Delete' })
                .expect(401);
        });
    });

    describe('GET /permission', () => {
        it('should return all permissions when Admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 403 when Student tries to list permissions', async () => {
            await request(app.getHttpServer())
                .get('/permission')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });

        it('should return 401 when no token', async () => {
            await request(app.getHttpServer()).get('/permission').expect(401);
        });
    });

    describe('GET /permission/:id', () => {
        it('should return permission by ID when Admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/permission/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body.name).toBe('Create');
        });

        it('should return 404 when permission does not exist', async () => {
            await request(app.getHttpServer())
                .get('/permission/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });

    describe('PATCH /permission/:id', () => {
        it('should update permission description when Admin', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/permission/${createdPermissionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'Updated update description' })
                .expect(200);

            expect(response.body.description).toBe('Updated update description');
        });

        it('should return 403 when Student tries to update', async () => {
            await request(app.getHttpServer())
                .patch('/permission/1')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ description: 'Hack' })
                .expect(403);
        });

        it('should return 404 when permission does not exist', async () => {
            await request(app.getHttpServer())
                .patch('/permission/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ description: 'Ghost' })
                .expect(404);
        });
    });

    describe('DELETE /permission/:id', () => {
        it('should delete the created permission when Admin', async () => {
            await request(app.getHttpServer())
                .delete(`/permission/${createdPermissionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });

        it('should return 404 when permission does not exist', async () => {
            await request(app.getHttpServer())
                .delete('/permission/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });

        it('should return 403 when Student tries to delete', async () => {
            await request(app.getHttpServer())
                .delete('/permission/1')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });
    });

    describe('POST /role-permission', () => {
        it('should assign Create permission to Student role (id 2 → id 1) when Admin', async () => {
            const response = await request(app.getHttpServer())
                .post('/role-permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ roleId: 2, permissionId: 1 }) 
                .expect(201);

            expect(response.body).toHaveProperty('id');
            createdRolePermissionId = response.body.id;
        });

        it('should return 409 when role already has that permission', async () => {
            await request(app.getHttpServer())
                .post('/role-permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ roleId: 1, permissionId: 2 })  
                .expect(409);
        });

        it('should return 404 when role does not exist', async () => {
            await request(app.getHttpServer())
                .post('/role-permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ roleId: 9999, permissionId: 1 })
                .expect(404);
        });

        it('should return 404 when permission does not exist', async () => {
            await request(app.getHttpServer())
                .post('/role-permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ roleId: 1, permissionId: 9999 })
                .expect(404);
        });

        it('should return 403 when Student tries to assign permission', async () => {
            await request(app.getHttpServer())
                .post('/role-permission')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ roleId: 2, permissionId: 1 })
                .expect(403);
        });
    });

    describe('GET /role-permission', () => {
        it('should return all role-permissions when Admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/role-permission')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 403 when Student tries to list', async () => {
            await request(app.getHttpServer())
                .get('/role-permission')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });
    });

    describe('GET /role-permission/:id', () => {
        it('should return role-permission by ID when Admin', async () => {
            const response = await request(app.getHttpServer())
                .get('/role-permission/1')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('role');
            expect(response.body).toHaveProperty('permission');
        });

        it('should return 404 when role-permission does not exist', async () => {
            await request(app.getHttpServer())
                .get('/role-permission/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });

    describe('DELETE /role-permission/:id', () => {
        it('should revoke the assigned permission when Admin', async () => {
            await request(app.getHttpServer())
                .delete(`/role-permission/${createdRolePermissionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });

        it('should return 404 when role-permission does not exist', async () => {
            await request(app.getHttpServer())
                .delete('/role-permission/9999')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });

        it('should return 403 when Student tries to delete', async () => {
            await request(app.getHttpServer())
                .delete('/role-permission/1')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(403);
        });
    });
});