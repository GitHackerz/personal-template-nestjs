import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../../../core/services/prisma.service';

/**
 * Helper class for user verification and validation
 * Handles checking user existence, status, and permissions
 */
@Injectable()
export class UserVerificationHelper {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Verifies if a user exists and is in the proper state
   * @param userId User ID to verify
   * @param options Verification options including role requirements
   * @returns The user object if verification passes
   * @throws NotFoundException if user doesn't exist
   * @throws UnauthorizedException if user has invalid state
   */
  async verifyUser(
    userId: string,
    options: {
      requiredRole?: UserRole;
    } = {},
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        security: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return this.verifyUserState(user, options);
  }

  /**
   * Verifies a user by email
   * @param email Email to verify
   * @param options Verification options including role requirements
   * @returns The user object if verification passes
   * @throws NotFoundException if user doesn't exist
   * @throws UnauthorizedException if user has invalid state
   */
  async verifyUserByEmail(
    email: string,
    options: {
      requiredRole?: UserRole;
    } = {},
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        profile: true,
        security: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    return this.verifyUserState(user, options);
  }

  /**
   * Verifies a user's state after the user has been retrieved
   * @param user User object to verify
   * @param options Verification options including role requirements
   * @returns The user object if verification passes
   * @throws UnauthorizedException if user has invalid state
   */

  private verifyUserState(
    user: any,
    options: {
      requiredRole?: UserRole;
    },
  ) {
    const { requiredRole } = options;

    if (!user.isActive) {
      throw new UnauthorizedException('Account is suspended or inactive');
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    if (user.security?.isBanned) {
      throw new UnauthorizedException('Account has been banned');
    }

    return user;
  }
}
