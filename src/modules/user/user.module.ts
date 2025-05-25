import { Module } from '@nestjs/common';

import { PrismaService } from '../../core/services/prisma.service';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsernameHelper } from '../auth/helpers/username.helper';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UsernameHelper],
  exports: [UserService],
})
export class UserModule {}
