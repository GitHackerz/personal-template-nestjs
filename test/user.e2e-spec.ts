import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/services/prisma.service';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('User Endpoints (e2e)', () => {
    let app: INestApplication;
    let createdUserId: string;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        prisma = app.get(PrismaService);

        // Clear database and create test users
        await prisma.user.deleteMany({});
    });

    it('POST /user - create user', () => {
        const userData = {
            email: 'user@example.com',
            password: 'password',
            name: 'Test User'
        };
        return request(app.getHttpServer())
            .post('/user')
            .send(userData)
            .expect(201)
            .then((response) => {
                expect(response.body).toHaveProperty('id');

                createdUserId = response.body.id;
            });
    });

    it('GET /user - get all users', () => {
        return request(app.getHttpServer()).get('/user').expect(200);
    });

    it('GET /user/:id - get one user', () => {
        return request(app.getHttpServer())
            .get(`/user/${createdUserId}`)
            .expect(200);
    });

    it('PATCH /user/:id - update user', () => {
        const updateData = {
            name: 'Updated User'
        };
        return request(app.getHttpServer())
            .patch(`/user/${createdUserId}`)
            .send(updateData)
            .expect(200);
    });

    it('DELETE /user/:id - delete user', () => {
        return request(app.getHttpServer())
            .delete(`/user/${createdUserId}`)
            .expect(200);
    });
});
