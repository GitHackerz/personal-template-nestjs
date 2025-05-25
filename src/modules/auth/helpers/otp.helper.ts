import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { CacheService } from '../../../core/services/cache.service';
import { generateOtp } from '../../../core/utils/auth';
import { SignUpDto } from '../dto/sign-up.dto';

import { EmailHelper } from './email.helper';
import { UserVerificationHelper } from './user-verification.helper';

/**
 * Helper class for OTP (One-Time Password) operations
 */
@Injectable()
export class OtpHelper {
  // Redis key prefixes and expiration time
  private readonly SIGNUP_KEY_PREFIX = 'signup:';
  private readonly PASSWORD_RESET_KEY_PREFIX = 'password-reset:';
  private readonly OTP_EXPIRY_MS = 900 * 1000; // 15 minutes in milliseconds

  constructor(
    private readonly cacheService: CacheService,
    private readonly emailHelper: EmailHelper,
    private readonly userVerification: UserVerificationHelper,
  ) {}

  /**
   * Generates a new OTP code
   */
  generateNewOtp(): string {
    return generateOtp();
  }

  async resendSignupOtp(email: string) {
    const userData = await this.cacheService.getJSON<any>(`signup:${email}`);
    if (!userData) {
      throw new BadRequestException('No pending signup found for this email');
    }

    const otp = this.generateNewOtp();
    await this.updateSignupOtpInCache(email, userData, otp);
    await this.emailHelper.sendVerificationEmail(email, otp);

    return {
      message: 'A new OTP has been sent to your email address',
      email,
    };
  }

  async resendPasswordResetOtp(email: string) {
    const user = await this.userVerification.verifyUserByEmail(email);
    const otp = this.generateNewOtp();

    await this.storePasswordResetOtp(email, otp);
    await this.emailHelper.sendPasswordResetEmail(user, otp);

    return {
      message: 'A new password reset OTP has been sent to your email address',
      email,
    };
  }

  /**
   * Stores signup data with OTP in cache
   */
  async storeSignupDataInCache(
    userData: SignUpDto,
    role: UserRole,
    otp: string,
  ): Promise<void> {
    const data = {
      ...userData,
      role,
      otp,
    };

    await this.cacheService.setJSON(
      `${this.SIGNUP_KEY_PREFIX}${userData.email}`,
      data,
      this.OTP_EXPIRY_MS,
    );
  }

  /**
   * Validates a signup OTP
   */
  async validateSignupOtp(email: string, otpCode: string): Promise<any> {
    const userData = await this.cacheService.getJSON<any>(
      `${this.SIGNUP_KEY_PREFIX}${email}`,
    );

    if (!userData) {
      throw new BadRequestException('OTP expired or not found');
    }

    if (userData.otp !== otpCode) {
      throw new UnauthorizedException('Invalid OTP');
    }

    return userData;
  }

  /**
   * Stores password reset OTP in cache
   */
  async storePasswordResetOtp(email: string, otp: string): Promise<void> {
    await this.cacheService.setJSON(
      `${this.PASSWORD_RESET_KEY_PREFIX}${email}`,
      { otp },
      this.OTP_EXPIRY_MS,
    );
  }

  /**
   * Validates a password reset OTP
   */
  async validatePasswordResetOtp(
    email: string,
    otpCode: string,
  ): Promise<void> {
    const data = await this.cacheService.getJSON<any>(
      `${this.PASSWORD_RESET_KEY_PREFIX}${email}`,
    );

    if (!data) {
      throw new BadRequestException('OTP expired or not found');
    }

    if (data.otp !== otpCode) {
      throw new UnauthorizedException('Invalid OTP');
    }
  }

  /**
   * Updates an existing signup OTP
   */
  async updateSignupOtpInCache(
    email: string,
    userData: any,
    otp: string,
  ): Promise<void> {
    userData.otp = otp;
    await this.cacheService.setJSON(
      `${this.SIGNUP_KEY_PREFIX}${email}`,
      userData,
      this.OTP_EXPIRY_MS,
    );
  }

  /**
   * Clears signup data from cache
   */
  async clearSignupOtpData(email: string): Promise<void> {
    await this.cacheService.del(`${this.SIGNUP_KEY_PREFIX}${email}`);
  }

  /**
   * Clears password reset data from cache
   */
  async clearPasswordResetOtpData(email: string): Promise<void> {
    await this.cacheService.del(`${this.PASSWORD_RESET_KEY_PREFIX}${email}`);
  }
}
