import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

import { CacheService } from '../../core/services/cache.service';
import { PrismaService } from '../../core/services/prisma.service';
import { comparePassword, cryptPassword } from '../../core/utils/auth';

import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CompleteRegistrationDto, SignUpDto } from './dto/sign-up.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthTokenHelper } from './helpers/auth-token.helper';
import { EmailHelper } from './helpers/email.helper';
import { OtpHelper } from './helpers/otp.helper';
import { PasswordHelper } from './helpers/password.helper';
import { UserVerificationHelper } from './helpers/user-verification.helper';
import { UsernameHelper } from './helpers/username.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly tokenHelper: AuthTokenHelper,
    private readonly otpHelper: OtpHelper,
    private readonly emailHelper: EmailHelper,
    private readonly passwordHelper: PasswordHelper,
    private readonly userVerification: UserVerificationHelper,
    private readonly usernameHelper: UsernameHelper,
  ) {}

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  // -------------------------
  // SIGNIN MODULE
  // -------------------------

  async signIn(credentials: LoginDto) {
    const { email, password } = credentials;

    // Verify the user is in a valid state for login
    const user = await this.userVerification.verifyUserByEmail(email);

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return this.tokenHelper.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const { id } = this.jwtService.verify(refreshToken, {
        secret: jwtSecret,
      });

      // Verify the user is still valid when refreshing tokens
      const user = await this.userVerification.verifyUser(id);
      const tokens = this.tokenHelper.generateTokens(user);
      return {
        token: tokens.token,
        refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // -------------------------
  // SIGNUP MODULE
  // -------------------------

  // Step 1: Initiate signup and send OTP
  async signUp(createDto: SignUpDto, role: UserRole = UserRole.USER) {
    // Ensure username is not provided or exists - we'll generate one later
    const { username, ...userData } = createDto;

    // Check if email already exists
    await this.emailHelper.validateNewUserEmail(userData.email);

    // Generate username if not provided
    const generatedUsername =
      username ||
      (await this.usernameHelper.generateUniqueUsername(userData.name));

    const otp = this.otpHelper.generateNewOtp();
    await this.otpHelper.storeSignupDataInCache(
      { ...userData, username: generatedUsername },
      role,
      otp,
    );
    await this.emailHelper.sendVerificationEmail(userData.email, otp);

    return {
      message: 'OTP has been sent to your email address for verification',
      email: userData.email,
    };
  }

  // Step 2: Verify the OTP without creating user
  async verifySignUpOtp(otpDto: VerifyOtpDto) {
    const { email, otpCode } = otpDto;
    await this.otpHelper.validateSignupOtp(email, otpCode);

    const verificationToken = this.tokenHelper.generateVerificationToken(email);

    return {
      message:
        'OTP verified successfully. You can now complete your registration.',
      email,
      verificationToken,
    };
  }

  // Step 3: Complete registration with password and create user;
  async completeRegistration(completeDto: CompleteRegistrationDto) {
    const { email, password, verificationToken } = completeDto;

    this.tokenHelper.validateVerificationToken(verificationToken, email);

    const userData = await this.cacheService.getJSON<any>(`signup:${email}`);
    if (!userData) {
      throw new BadRequestException(
        'Registration session expired. Please start the signup process again.',
      );
    }

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          username: userData.username,
          password: await cryptPassword(password),
          role: userData.role || UserRole.USER,
          profile: {
            create: {},
          },
          security: {
            create: {},
          },
        },
        include: {
          profile: true,
          security: true,
        },
      });

      await this.cacheService.del(`signup:${email}`);

      return this.tokenHelper.generateTokens(user);
    } catch (error) {
      this.handleUserCreationError(error);
    }
  }

  private;

  // -------------------------
  // FORGET PASSWORD MODULE
  // -------------------------

  async forgetPassword(email: string): Promise<any> {
    try {
      const user = await this.userVerification.verifyUserByEmail(email);
      const otp = this.otpHelper.generateNewOtp();

      await this.otpHelper.storePasswordResetOtp(email, otp);
      await this.emailHelper.sendPasswordResetEmail(user, otp);

      return {
        message: 'Password reset instructions sent to your email',
        email,
      };
    } catch (error) {
      this.passwordHelper.handlePasswordResetError(error);
    }
  }

  async verifyResetPasswordOtp(otpDto: VerifyOtpDto) {
    const { email, otpCode } = otpDto;

    // Validate OTP from Redis
    await this.otpHelper.validatePasswordResetOtp(email, otpCode);

    // Clear OTP data after successful verification
    await this.otpHelper.clearPasswordResetOtpData(email);

    const verificationToken = this.tokenHelper.generateVerificationToken(email);

    return {
      message: 'OTP verified successfully. You can now reset your password.',
      email,
      verificationToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, verificationToken } = resetPasswordDto;

    // Use the token helper to validate the verification token
    this.tokenHelper.validateVerificationToken(verificationToken, email);

    await this.passwordHelper.updateUserPassword(
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }

  // -------------------------
  // COMMON METHODS
  // -------------------------

  async resendOtp(email: string, purpose: 'signup' | 'password-reset') {
    if (purpose === 'signup') {
      return this.otpHelper.resendSignupOtp(email);
    } else if (purpose === 'password-reset') {
      return this.otpHelper.resendPasswordResetOtp(email);
    }
    throw new BadRequestException('Invalid purpose for OTP resend');
  }

  private handleUserCreationError(error: any) {
    if (error.code === 'P2002') {
      throw new ConflictException('Username or email already exists');
    }
    throw error;
  }
}
