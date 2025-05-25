import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '../../../modules/user/user.service';

import { MailService } from '../../../core/services/mail.service';

/**
 * Helper for sending authentication-related emails
 */
@Injectable()
export class EmailHelper {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  /**
   * Sends verification email with OTP code
   * @param email Recipient email address
   * @param otp The OTP code to include in the email
   */
  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    await this.mailService.sendMail({
      to: email,
      subject: 'Verify Your Email Address',
      template: 'verify-account',
      context: {
        otp,
        expiryMinutes: 10, // OTP expires in 10 minutes
      },
    });
  }

  /**
   * Sends password reset email with OTP code
   * @param user User object or email string
   * @param otp The OTP code to include in the email
   */
  async sendPasswordResetEmail(user: any, otp: string): Promise<void> {
    const email = typeof user === 'string' ? user : user.email;
    const name = typeof user === 'string' ? '' : user.name;

    await this.mailService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: 'reset-password',
      context: {
        otp,
        name,
        expiryMinutes: 10, // OTP expires in 10 minutes
      },
    });
  }

  async validateNewUserEmail(email: string): Promise<void> {
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }
}
