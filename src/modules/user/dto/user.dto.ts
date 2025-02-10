import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @Transform(({ value }) => value.toLowerCase().trim())
    email: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    @Transform(({ value }) => value.trim())
    name: string;

    @ApiProperty({
        example: 'StrongPass123!',
        description:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(32, { message: 'Password cannot exceed 32 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak'
    })
    password: string;

    @ApiProperty({ required: false, example: 'image.jpg' })
    @IsOptional()
    @Transform(({ value }) => value?.trim())
    image?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
