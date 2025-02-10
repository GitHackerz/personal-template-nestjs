import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../core/services/prisma.service';
import * as authUtils from '../../core/utils/auth';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    const mockPrismaService = {
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: PrismaService, useValue: mockPrismaService }
            ]
        }).compile();
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user with hashed password and isVerified false', async () => {
            const dto = {
                email: 'user@example.com',
                name: 'Test User',
                password: 'StrongPass123!',
                image: 'avatar.png'
            };
            jest.spyOn(authUtils, 'cryptPassword').mockResolvedValue('hashed');
            const expectedUser = {
                id: '1',
                email: dto.email,
                name: dto.name,
                password: 'hashed',
                isVerified: false,
                image: dto.image
            };
            mockPrismaService.user.create.mockResolvedValue(expectedUser);
            expect(await service.create(dto)).toBe(expectedUser);
            expect(authUtils.cryptPassword).toHaveBeenCalledWith(dto.password);
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: { ...dto, password: 'hashed', isVerified: false }
            });
        });
    });

    describe('findAll', () => {
        it('should return list of users', async () => {
            const users = [
                {
                    id: '1',
                    email: 'user@example.com',
                    name: 'Test User',
                    password: 'hashed',
                    isVerified: false
                }
            ];
            mockPrismaService.user.findMany.mockResolvedValue(users);
            expect(await service.findAll()).toBe(users);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            const user = {
                id: '1',
                email: 'user@example.com',
                name: 'Test User',
                password: 'hashed',
                isVerified: false
            };
            mockPrismaService.user.findUnique.mockResolvedValue(user);
            expect(await service.findOne('1')).toBe(user);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateDto = { name: 'Updated User' };
            const updatedUser = {
                id: '1',
                email: 'user@example.com',
                name: 'Updated User',
                password: 'hashed',
                isVerified: false
            };
            mockPrismaService.user.update.mockResolvedValue(updatedUser);
            expect(await service.update('1', updateDto)).toBe(updatedUser);
            expect(mockPrismaService.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: updateDto
            });
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            const deletedUser = {
                id: '1',
                email: 'user@example.com',
                name: 'Test User',
                password: 'hashed',
                isVerified: false
            };
            mockPrismaService.user.delete.mockResolvedValue(deletedUser);
            expect(await service.remove('1')).toBe(deletedUser);
            expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });
    });
});
