import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto, CompleteRegistrationDto } from './dto/sign-up.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() credentials: LoginDto) {
    return this.authService.signIn(credentials);
  }

  @Post('sign-up/participant')
  @ApiOperation({
    summary: 'Step 1: Initiate participant registration and send OTP',
  })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  async signUpParticipant(@Body() user: SignUpDto) {
    return this.authService.signUp(user);
  }

  @Post('verify-signup-otp')
  @ApiOperation({ summary: 'Step 2: Verify OTP code for signup' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  async verifySignUpOtp(@Body() otpDto: VerifyOtpDto) {
    return this.authService.verifySignUpOtp(otpDto);
  }

  @Post('complete-registration')
  @ApiOperation({
    summary: 'Step 3: Complete registration with password and create user',
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  async completeRegistration(@Body() completeDto: CompleteRegistrationDto) {
    return this.authService.completeRegistration(completeDto);
  }

  @Post('verify-reset-otp')
  @ApiOperation({ summary: 'Verify OTP code for password reset' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified for password reset',
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  async verifyResetPasswordOtp(@Body() otpDto: VerifyOtpDto) {
    return this.authService.verifyResetPasswordOtp(otpDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP code' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async resendOtp(
    @Body('email') email: string,
    @Body('purpose') purpose: 'signup' | 'password-reset' = 'signup',
  ) {
    return this.authService.resendOtp(email, purpose);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { example: { refreshToken: 'string' } } })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
