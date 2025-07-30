
import { signJwt, verifyJwt } from '@/utils/jwt';
import jwt from 'jsonwebtoken';

describe('JWT Utils', () => {
  const mockPayload = { id: 1, email: 'test@example.com', userType: 'client' };
  const secret = process.env.JWT_SECRET || 'test-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  beforeAll(() => {
    // Mock process.env for consistent testing
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  afterAll(() => {
    // Clean up mock
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRES_IN;
  });

  describe('signJwt', () => {
    it('should sign a JWT token with the given payload', () => {
      const token = signJwt(mockPayload);
      expect(typeof token).toBe('string');
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      expect(decoded.id).toBe(mockPayload.id);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });
  });

  describe('verifyJwt', () => {
    it('should verify a valid JWT token', () => {
      const token = jwt.sign(mockPayload, secret, { expiresIn: '1h' });
      const decoded = verifyJwt(token);
      expect(decoded.id).toBe(mockPayload.id);
      expect(decoded.email).toBe(mockPayload.email);
    });

    it('should throw an error for an invalid token', () => {
      const invalidToken = 'invalid.token.string';
      expect(() => verifyJwt(invalidToken)).toThrow();
    });

    it('should throw an error for an expired token', () => {
      const expiredToken = jwt.sign(mockPayload, secret, { expiresIn: '0s' });
      // Wait for a short moment to ensure token expires
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => verifyJwt(expiredToken)).toThrow(jwt.TokenExpiredError);
          resolve(null);
        }, 100);
      });
    });
  });
});
