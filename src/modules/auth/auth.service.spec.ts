import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../core/services/prisma.service';
import * as authUtils from '../../core/utils/auth'; // added import
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findFirst: jest.fn()
        }
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('jwt_token'),
        verify: jest.fn()
    };

    const mockMailerService = {
        sendMail: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
                }
            ]
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signIn', () => {
        it('should successfully login and return tokens', async () => {
            const loginDto = {
                email: 'user@example.com',
                password: 'StrongPass123!'
            };
            // Provide additional fields if required by signIn, including isVerified: true
            mockPrismaService.user.findUnique.mockResolvedValue({
                id: '1',
                email: loginDto.email,
                name: 'Test User',
                password: 'hashed',
                image: 'image.jpg',
                isVerified: true // added to pass verification
            });
            // Force comparePassword to resolve true
            jest.spyOn(authUtils, 'comparePassword').mockResolvedValue(true);

            const result = await service.signIn(loginDto);
            expect(result).toEqual({
                token: 'jwt_token',
                refreshToken: 'jwt_token'
            });
            expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
        });
    });
});
