import * as bcrypt from 'bcryptjs';

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password to compare
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Hashes a password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export const cryptPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const generateRandomPassword = (length = 12): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+=-[]{}|:;<>?,./';

  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';

  // Ensure password has at least one character from each category
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  // Fill rest of the password with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password to make it truly random
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
};

/**
 * Configuration options for OTP generation
 * @interface OtpConfig
 * @property {number} [expiresInMinutes=15] - Number of minutes until OTP expires
 * @property {number} [digits=4] - Number of digits in the OTP
 */
export interface OtpConfig {
  expiresInMinutes?: number;
  digits?: number;
}

/**
 * Generates a random OTP (One Time Password)
 * @param {OtpConfig} config - Configuration options for OTP generation
 *
 */
export function generateOtp(config: OtpConfig = {}): string {
  const { digits = 4 } = config;

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}
