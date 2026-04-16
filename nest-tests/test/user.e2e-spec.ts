import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';

describe('Users E2E', () => {
    let app: NestExpressApplication;
    let adminToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Login y obtención de token
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'admin@example.com', password: 'secret123' })
            .expect(201);

        const body = response.body as { access_token: string };
        adminToken = body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('should create a new user', async () => {
        const createUserDto = {
            username: 'newuser',
            email: 'newuser2@test.com',
            passwordHash: 'secret123',
            bio: 'New test user',
            roleName: 'admin',
        };

        const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(createUserDto)
            .expect(201);

        const body = response.body as { id: number; username: string };
        expect(body).toHaveProperty('id');
        expect(body.username).toBe(createUserDto.username);
    });

    it('should return all users', async () => {
        const response = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        const body = response.body as { id: number; username: string }[];
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
    });

    it('should return a user by ID with no relations', async () => {
        // Arrange
        const userId = 1;
        const expectedUser = {
            id: userId,
            username: 'admin_user',
        };

        // Act
        const response = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(200);

        const body = response.body as { id: number; username: string };

        //Assert
        expect(body).toHaveProperty('id', userId);
        expect(body).toHaveProperty('username', expectedUser.username);
    });
});
