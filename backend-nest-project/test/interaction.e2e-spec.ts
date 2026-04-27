import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Interaction E2E (Post & Reply)', () => {
    let app: INestApplication;
    let studentToken: string;
    let createdPostId: number;
    let createdReplyId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'alice@example.com', password: 'Password123' });
        studentToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /post', () => {
        it('should create a new post', async () => {
            const response = await request(app.getHttpServer())
                .post('/post')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    userId: 1,
                    title: 'E2E Post',
                    question: 'How does E2E testing work?',
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            createdPostId = response.body.id;
        });
    });

    describe('GET /post', () => {
        it('should return all posts', async () => {
            const response = await request(app.getHttpServer())
                .get('/post')
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('POST /reply', () => {
        it('should create a new reply', async () => {
            const response = await request(app.getHttpServer())
                .post('/reply')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    postId: createdPostId,
                    userId: 1,
                    replyMessage: 'This is an E2E reply',
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            createdReplyId = response.body.id;
        });
    });

    describe('PATCH /reply/:id/like', () => {
        it('should increment likes', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/reply/${createdReplyId}/like`)
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(200);

            expect(response.body.likes).toBe(1);
        });
    });

    describe('PATCH /reply/:id/validate', () => {
        it('should validate the reply', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/reply/${createdReplyId}/validate`)
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(200);

            expect(response.body.isValidated).toBe(true);
            expect(response.body.approvals).toBe(1);
        });
    });

    describe('DELETE /post/:id', () => {
        it('should delete the post', async () => {
            await request(app.getHttpServer())
                .delete(`/post/${createdPostId}`)
                .set('Authorization', `Bearer ${studentToken}`)
                .expect(200);
        });
    });
});
