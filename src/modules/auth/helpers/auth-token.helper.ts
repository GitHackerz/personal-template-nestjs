import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * Handles token generation and validation for authentication processes
 */
@Injectable()
export class AuthTokenHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generates access and refresh tokens for authenticated users
   * @param user The user object containing identification information
   * @returns Object containing access token, refresh token, and expiration time
   */
  generateTokens(user: {
    id: string;
    name: string;
    email: string;
    image: string;
  }) {
    const payload = { id: user.id };
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    const token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: jwtSecret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: jwtSecret,
    });

    return {
      token,
      refreshToken,
      expiresIn: new Date().getTime() + 3600000,
    };
  }

  /**
   * Creates a short-lived token for verification purposes
   * @param email Email address to include in the token
   * @param additionalData Optional additional data for the token
   * @returns Signed JWT token
   */
  generateVerificationToken(
    email: string,
    additionalData: Record<string, any> = {},
  ): string {
    const payload = {
      email,
      verified: true,
      ...additionalData,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  /**
   * Validates a verification token
   * @param token The token to validate
   * @param email The email that should be in the token
   * @throws UnauthorizedException if invalid
   */
  validateVerificationToken(token: string, email: string): void {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (!decoded?.verified || decoded?.email !== email) {
        throw new UnauthorizedException('Invalid verification token');
      }
    } catch {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
  }
}
