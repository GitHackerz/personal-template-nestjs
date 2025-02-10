import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../core/services/prisma.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
            findFirst: jest.fn()
        }
    };

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn()
    };

    const mockMailerService = {
        sendMail: jest.fn()
    };

    const mockFileUploadService = {
        uploadFile: jest.fn()
    };

    const mockAuthService = {
        signIn: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: MailerService,
                    useValue: mockMailerService
                },
                {
                    provide: FileUploadService,
                    useValue: mockFileUploadService
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ]
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signIn', () => {
        it('should return tokens on successful signIn', async () => {
            const loginDto = {
                email: 'user@example.com',
                password: 'StrongPass123!'
            };
            const tokenResponse = {
                token: 'jwt_token',
                refreshToken: 'jwt_token'
            };
            mockAuthService.signIn.mockResolvedValue(tokenResponse);
            expect(await controller.signIn(loginDto)).toBe(tokenResponse);
            expect(mockAuthService.signIn).toHaveBeenCalledWith(loginDto);
        });
    });
});
