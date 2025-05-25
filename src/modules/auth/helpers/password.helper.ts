import { Injectable, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../../../core/services/prisma.service';
import { cryptPassword } from '../../../core/utils/auth';

import { OtpHelper } from './otp.helper';

/**
 * Helper for password management operations
 */
@Injectable()
export class PasswordHelper {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly otpHelper: OtpHelper,
  ) {}

  /**
   * Updates a user's password in the database
   * @param email User's email address
   * @param newPassword New password (will be hashed)
   */
  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await cryptPassword(newPassword);

    await this.prismaService.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Clear any password reset OTP data
    await this.otpHelper.clearPasswordResetOtpData(email);
  }

  /**
   * Handles errors during password reset process
   * @param error The error object
   * @throws BadRequestException with appropriate message
   */
  handlePasswordResetError(error: any): void {
    console.error('Password reset error:', error);
    throw new BadRequestException('Failed to reset password');
  }
}
