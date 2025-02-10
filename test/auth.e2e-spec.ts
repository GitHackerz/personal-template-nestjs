import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/core/services/prisma.service';
import { AppModule } from './../src/app.module';

describe('Auth Endpoints (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let verifiedUser: any;
    let nonVerifiedUser: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        prisma = app.get(PrismaService);

        // Clear database and create test users
        await prisma.user.deleteMany({});

        // Create verified user for sign-in, refresh, forget and reset-password tests
        const verifiedRes = await request(app.getHttpServer())
            .post('/user')
            .send({
                email: 'test@example.com',
                password: 'password',
                name: 'Test User'
            });
        verifiedUser = verifiedRes.body;
        // Updated: use email instead of id
        await prisma.user.update({
            where: { email: verifiedUser.email },
            data: { isVerified: true }
        });

        // Create non-verified user for OTP tests
        const nonVerifiedRes = await request(app.getHttpServer())
            .post('/user')
            .send({
                email: 'otp@example.com',
                password: 'password',
                name: 'OTP User'
            });
        nonVerifiedUser = nonVerifiedRes.body;
        await prisma.user.update({
            where: { email: nonVerifiedUser.email },
            data: {
                isVerified: false,
                otpCode: '1234',
                otpCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });
    });

    it('POST /auth/sign-in - user login', () => {
        const credentials = { email: 'test@example.com', password: 'password' };
        return request(app.getHttpServer())
            .post('/auth/sign-in')
            .send(credentials)
            .expect(201)
            .then((response) => {
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('refreshToken');
            });
    });

    it('POST /auth/verify-otp - verify OTP', () => {
        const otpPayload = { email: 'otp@example.com', otpCode: '1234' };
        return request(app.getHttpServer())
            .post('/auth/verify-otp')
            .send(otpPayload)
            .expect(201);
    });

    it('POST /auth/resend-otp - resend OTP', async () => {
        await request(app.getHttpServer())
            .post('/auth/resend-otp')
            .send({ email: 'otp@example.com' })
            .expect(201);
    }, 15000);

    it('POST /auth/refresh-token - refresh token', async () => {
        // Get valid refresh token from sign-in
        const loginRes = await request(app.getHttpServer())
            .post('/auth/sign-in')
            .send({ email: 'test@example.com', password: 'password' })
            .expect(201);
        const validRefreshToken = loginRes.body.refreshToken;
        return request(app.getHttpServer())
            .post('/auth/refresh-token')
            .send({ refreshToken: validRefreshToken })
            .expect(201)
            .then((response) => {
                expect(response.body).toHaveProperty('token');
            });
    });

    it('POST /auth/forget-password - request reset', () => {
        return request(app.getHttpServer())
            .post('/auth/forget-password')
            .send({ email: 'test@example.com' })
            .expect(201);
    });

    it('POST /auth/reset-password - reset password', () => {
        const pwdPayload = {
            email: 'test@example.com',
            password: 'newpassword'
        };
        return request(app.getHttpServer())
            .post('/auth/reset-password')
            .send(pwdPayload)
            .expect(201);
    });
});
