import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../core/services/prisma.service';

@Injectable()
export class UsernameHelper {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Generates a unique username based on the user's email
   * @param email User's email address
   * @returns A unique username
   */
  async generateUniqueUsername(email: string): Promise<string> {
    // Extract username part from email (before @) and convert to lowercase
    let baseUsername = email.split('@')[0].toLowerCase().replace(/[^\w]/gi, '');

    // Ensure minimum length
    if (baseUsername.length < 3) {
      baseUsername = baseUsername.padEnd(3, '0');
    }

    // Check if username already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { username: baseUsername },
    });

    // If username is unique, return it
    if (!existingUser) {
      return baseUsername;
    }

    // If username exists, add random numbers until unique
    let uniqueUsername = '';
    let isUnique = false;

    while (!isUnique) {
      // Add a random number between 100-999
      const randomSuffix = Math.floor(Math.random() * 900) + 100;
      uniqueUsername = `${baseUsername}_${randomSuffix}`;

      const userWithSameUsername = await this.prismaService.user.findUnique({
        where: { username: uniqueUsername },
      });

      isUnique = !userWithSameUsername;
    }

    return uniqueUsername;
  }
}
