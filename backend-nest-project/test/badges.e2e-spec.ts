import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Badges E2E', () => {
    let app: INestApplication;
    let adminToken: string;
    let createdBadgeId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'dave@example.com', password: 'Password123' });
        adminToken = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/experience-badge', () => {
        it('should create a badge', async () => {
            const res = await request(app.getHttpServer())
                .post('/experience-badge')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'E2E Badge',
                    description: 'Testing',
                    levelRequired: 5,
                    icon: 'test.png',
                })
                .expect(201);
            createdBadgeId = res.body.id;
        });

        it('should get all badges', async () => {
            await request(app.getHttpServer())
                .get('/experience-badge')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });

    describe('/user-badge', () => {
        it('should link user to badge', async () => {
            await request(app.getHttpServer())
                .post('/user-badge')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: 1,
                    experienceBadgeId: createdBadgeId,
                })
                .expect(201);
        });
    });
});
