import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BaseService } from '../../core/services/base.service';
import { PrismaService } from '../../core/services/prisma.service';
import { cryptPassword } from '../../core/utils/auth';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService extends BaseService<
    User,
    CreateUserDto,
    UpdateUserDto
> {
    constructor(private readonly prismaService: PrismaService) {
        super(prismaService.user, 'User');
    }

    async create(createDto: CreateUserDto): Promise<User> {
        return this.prismaService.user.create({
            data: {
                ...createDto,
                password: await cryptPassword(createDto.password),
                isVerified: false
            }
        });
    }
}
