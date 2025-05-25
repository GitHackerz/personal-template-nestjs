import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CacheService } from '../../core/services/cache.service';
import { MailService } from '../../core/services/mail.service';
import { PrismaService } from '../../core/services/prisma.service';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenHelper } from './helpers/auth-token.helper';
import { EmailHelper } from './helpers/email.helper';
import { OtpHelper } from './helpers/otp.helper';
import { PasswordHelper } from './helpers/password.helper';
import { UserVerificationHelper } from './helpers/user-verification.helper';
import { UsernameHelper } from './helpers/username.helper';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    CacheService,
    MailService,
    AuthTokenHelper,
    OtpHelper,
    EmailHelper,
    PasswordHelper,
    UserVerificationHelper,
    UsernameHelper,
  ],
  exports: [AuthService, UsernameHelper],
})
export class AuthModule {}
