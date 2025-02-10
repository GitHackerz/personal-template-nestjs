import * as bcrypt from 'bcryptjs';

export const comparePassword = async (
    password: string,
    hashedPassword: string
) => {
    return bcrypt.compare(password, hashedPassword);
};

export const cryptPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};
