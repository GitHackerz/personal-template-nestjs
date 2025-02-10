import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}
