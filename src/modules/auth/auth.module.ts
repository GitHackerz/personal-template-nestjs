import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../core/services/prisma.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET', 'secret'),
                signOptions: { expiresIn: '1d' }
            })
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, FileUploadService]
})
export class AuthModule {}
