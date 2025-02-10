import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
    let controller: UserController;
    const mockUserService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService
                }
            ]
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a new user', async () => {
        const dto = {
            email: 'user@example.com',
            name: 'Test User',
            password: 'StrongPass123!'
        }; // adjusted CreateUserDto
        const result = {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
            password: 'hashed',
            isVerified: false
        };
        mockUserService.create.mockResolvedValue(result);
        expect(await controller.create(dto)).toBe(result);
        expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });

    it('should get all users', async () => {
        const result = [
            {
                id: '1',
                email: 'user@example.com',
                name: 'Test User',
                password: 'hashed',
                isVerified: false
            }
        ];
        mockUserService.findAll.mockResolvedValue(result);
        expect(await controller.findAll()).toBe(result);
        expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('should get a user by id', async () => {
        const result = {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
            password: 'hashed',
            isVerified: false
        };
        mockUserService.findOne.mockResolvedValue(result);
        expect(await controller.findOne('1')).toBe(result);
        expect(mockUserService.findOne).toHaveBeenCalledWith('1');
    });

    it('should update a user', async () => {
        const updateDto = { name: 'Updated User' }; // adjusted UpdateUserDto
        const result = {
            id: '1',
            email: 'user@example.com',
            name: 'Updated User',
            password: 'hashed',
            isVerified: false
        };
        mockUserService.update.mockResolvedValue(result);
        expect(await controller.update('1', updateDto)).toBe(result);
        expect(mockUserService.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should remove a user', async () => {
        const result = {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
            password: 'hashed',
            isVerified: false
        };
        mockUserService.remove.mockResolvedValue(result);
        expect(await controller.remove('1')).toBe(result);
        expect(mockUserService.remove).toHaveBeenCalledWith('1');
    });
});
