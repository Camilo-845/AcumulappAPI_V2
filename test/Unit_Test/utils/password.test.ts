
import { hashPassword, comparePassword } from '@/utils/password';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn((password, salt) => Promise.resolve(`hashed_${password}_${salt}`)),
  compare: jest.fn((password, hash) => Promise.resolve(hash === `hashed_${password}_10`)),
}));

describe('Password Utils', () => {
  const plainPassword = 'mysecretpassword';
  const hashedPassword = 'hashed_mysecretpassword_10';

  describe('hashPassword', () => {
    it('should hash a plain password', async () => {
      const result = await hashPassword(plainPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should return true for a matching password and hash', async () => {
      const result = await comparePassword(plainPassword, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for a non-matching password and hash', async () => {
      const wrongPassword = 'wrongpassword';
      const result = await comparePassword(wrongPassword, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledWith(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });
});
