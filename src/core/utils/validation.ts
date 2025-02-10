import { isEmpty, isNullOrUndefined } from './helpers';

// Checks if string meets minimum length
export const hasMinLength = (str: string, minLength: number): boolean => {
    if (typeof str !== 'string') return false;
    return str.length >= minLength;
};

// Checks if string meets maximum length
export const hasMaxLength = (str: string, maxLength: number): boolean => {
    if (typeof str !== 'string') return false;
    return str.length <= maxLength;
};

// Validates string against regex pattern
export const matchesPattern = (str: string, pattern: RegExp): boolean => {
    if (typeof str !== 'string') return false;
    return pattern.test(str);
};

// Checks if number is within specified range
export const isNumberInRange = (
    value: number,
    min: number,
    max: number
): boolean => {
    if (typeof value !== 'number' || isNaN(value)) return false;
    return value >= min && value <= max;
};

// Validates date with optional constraints
export const isValidDate = (
    date: Date | string,
    options: {
        minDate?: Date;
        maxDate?: Date;
        futureOnly?: boolean;
        pastOnly?: boolean;
    } = {}
): boolean => {
    const dateObj = new Date(date);
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return false;

    const now = new Date();

    if (options.minDate && dateObj < options.minDate) return false;
    if (options.maxDate && dateObj > options.maxDate) return false;
    if (options.futureOnly && dateObj < now) return false;
    if (options.pastOnly && dateObj > now) return false;

    return true;
};

// Checks if object has all required fields
export const hasRequiredFields = <T extends object>(
    obj: T,
    requiredFields: (keyof T)[]
): boolean => {
    if (isEmpty(obj)) return false;
    return requiredFields.every(
        (field) => !isNullOrUndefined(obj[field]) && !isEmpty(obj[field])
    );
};

// Validates URL with optional protocol requirements
export const isValidUrl = (
    url: string,
    options: {
        protocols?: string[];
        requireProtocol?: boolean;
    } = {}
): boolean => {
    try {
        const urlObj = new URL(url);
        if (
            options.protocols &&
            !options.protocols.includes(urlObj.protocol.slice(0, -1))
        ) {
            return false;
        }
        return true;
    } catch {
        if (!options.requireProtocol) {
            return isValidUrl(`http://${url}`, options);
        }
        return false;
    }
};

// Validates password strength against security criteria
export const isStrongPassword = (
    password: string,
    options: {
        minLength?: number;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
    } = {}
): boolean => {
    const {
        minLength = 8,
        requireNumbers = true,
        requireSpecialChars = true,
        requireUppercase = true,
        requireLowercase = true
    } = options;

    if (!hasMinLength(password, minLength)) return false;
    if (requireNumbers && !/\d/.test(password)) return false;
    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password))
        return false;
    if (requireUppercase && !/[A-Z]/.test(password)) return false;
    if (requireLowercase && !/[a-z]/.test(password)) return false;

    return true;
};

// Validates array length and contents
export const isValidArray = <T>(
    arr: T[],
    options: {
        minLength?: number;
        maxLength?: number;
        unique?: boolean;
        validator?: (item: T) => boolean;
    } = {}
): boolean => {
    if (!Array.isArray(arr)) return false;

    const { minLength, maxLength, unique, validator } = options;

    if (minLength !== undefined && arr.length < minLength) return false;
    if (maxLength !== undefined && arr.length > maxLength) return false;
    if (unique && new Set(arr).size !== arr.length) return false;
    if (validator && !arr.every(validator)) return false;

    return true;
};

// Validates email format
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
