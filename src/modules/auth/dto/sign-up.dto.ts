import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'john_doe',
    description: 'Username (optional - will be auto-generated if not provided)',
    required: false,
  })
  username?: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  name: string;
}

export class CompleteRegistrationDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#^()-_+=]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @ApiProperty({
    example: 'P@ssw0rd',
    description: 'Password (must meet complexity requirements)',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Verification token received after OTP verification',
  })
  verificationToken: string;
}
